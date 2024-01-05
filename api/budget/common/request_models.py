import collections

class Request(object):
    def __init__(self, values: dict) -> None:
        self.headers: CaseInsensitiveDict = CaseInsensitiveDict(values.get('headers', {}))
        self.body = values.get('message')


class CaseInsensitiveDict(collections.abc.Mapping):
    def __init__(self, d):
        self._d = d
        self._s = dict((k.lower(), k) for k in d)
    def __contains__(self, k):
        return k.lower() in self._s
    def __len__(self):
        return len(self._s)
    def __iter__(self):
        return iter(self._s)
    def __getitem__(self, k):
        return self._d[self._s[k.lower()]]
    def actual_key_case(self, k):
        return self._s.get(k.lower())