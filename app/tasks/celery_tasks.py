"""Celery tasks placeholders aligned with technical specification."""


def sync_suppliers() -> str:
    return "suppliers synced"


def check_payment_statuses() -> str:
    return "payment statuses checked"


def update_delivery_statuses() -> str:
    return "delivery statuses updated"


def cleanup_old_carts() -> str:
    return "old carts cleaned"


def send_abandoned_cart_reminders() -> str:
    return "reminders sent"


def refresh_product_stats() -> str:
    return "product stats refreshed"


def backup_database() -> str:
    return "database backup done"
