
def search(objects, field, search_text):
    search_text = search_text.lower()
    identical_list =[]
    contains_list = []

    for obj in objects:
        if field in obj:
            object_field_value = str(obj[field]).lower()
            if object_field_value == search_text:
                identical_list.append(obj)
            elif search_text in object_field_value:
                contains_list.append(obj)

    if not identical_list and not contains_list:
        return "No results found"

    return identical_list + contains_list


def search_by_start_time(objects, field, timestamp_a, timestamp_b):
    # TODO: check front-end timestamp length
    objects_result = []
    for obj in objects:
        object_start_time = obj[field]["$date"]
        if float(timestamp_b) >= object_start_time >= float(timestamp_a):
            objects_result.append(obj)
    if not objects_result:
        objects_result = "No results found"
    return objects_result


