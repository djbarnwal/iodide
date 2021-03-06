# this functionality cribbed from treeherder:
# https://github.com/mozilla/treeherder/blob/2501fbc10ad4ec8da6cb4d1a49472f866659ed64/treeherder/middleware.py

import re

from whitenoise.middleware import WhiteNoiseMiddleware


class CustomWhiteNoise(WhiteNoiseMiddleware):
    """
    Adds two additional features to WhiteNoise:

    1) Serving index pages for directory paths (such as the site root).
    2) Setting long max-age headers for bundled js files
    """

    # Matches webpack's style of chunk filenames. eg:
    # index.f03882a6258f16fceb70.bundle.js
    IMMUTABLE_FILE_RE = re.compile(r'\.[a-f0-9]{16,}\.bundle\.(js|css)$')

    def is_immutable_file(self, path, url):
        """Support webpack bundle filenames when setting long max-age headers."""
        if self.IMMUTABLE_FILE_RE.search(url):
            return True
        # Otherwise fall back to the default method, so we catch filenames in the
        # style output by GzipManifestStaticFilesStorage during collectstatic. eg:
        #   bootstrap.min.abda843684d0.js
        return super(CustomWhiteNoise, self).is_immutable_file(path, url)
