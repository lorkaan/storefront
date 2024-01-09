

def merge_dictionary_list(dict_list):
    if isinstance(dict_list, list) and len(dict_list) > 0:
        result = {}
        for d in dict_list:
            if isintance(d, dict):
                for k in d.keys():
                    try:
                        cur = result[k]
                    except KeyError:
                        cur = []
                    if not isinstance(cur, list):
                        cur = list(cur)
                        result[k] = cur
                    result[k].append(d[k])
            else:
                continue
        return result
    else:
        return {}

