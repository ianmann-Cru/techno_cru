from django.conf import settings

def ctx_with_settings(context):
    """
    Adds settings to the context and returns the result.
    """
    context["settings"] = settings
    return context
