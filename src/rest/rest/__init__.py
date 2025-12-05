"""
rest package initialization.

Provides a package version and installs a NullHandler on the package logger
so importing this package in different environments does not emit unwanted
'No handler found' warnings.
"""

__version__ = "0.1.0"

import logging

# Avoid "No handler found" warnings when modules import this package's logger.
logging.getLogger(__name__).addHandler(logging.NullHandler())