from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
from pymongo import MongoClient

logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ.get("MONGO_HOST", "localhost") + ':' + os.environ.get("MONGO_PORT", "27017")
db = MongoClient(mongo_uri)['test_db']
todos_coll = db['todos']

class TodoListView(APIView):

    def get(self, request):
        try:
            items = []
            cursor = todos_coll.find().sort('_id', -1)
            for doc in cursor:
                doc['_id'] = str(doc.get('_id'))
                items.append(doc)
            return Response(items, status=status.HTTP_200_OK)
        except Exception:
            logger.exception("Failed to fetch todos from MongoDB")
            return Response({'detail': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        try:
            # request.data is provided by DRF; fall back to parsing body if necessary
            data = request.data if hasattr(request, 'data') else json.loads(request.body.decode('utf-8') or '{}')
            text = data.get('todo') or data.get('text') or data.get('description')
            if not text or not isinstance(text, str) or not text.strip():
                return Response({'detail': 'Missing todo text'}, status=status.HTTP_400_BAD_REQUEST)

            doc = {'text': text.strip()}
            result = todos_coll.insert_one(doc)
            doc['_id'] = str(result.inserted_id)
            return Response(doc, status=status.HTTP_201_CREATED)
        except Exception:
            logger.exception("Failed to create todo in MongoDB")
            return Response({'detail': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

