from fastapi.testclient import TestClient
from main import app
from services.auth import get_api_key


def override_get_api_key():
    return True


app.dependency_overrides[get_api_key] = override_get_api_key

client = TestClient(app)


def test_health_check():
    response = client.get("/health/")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_root_redirects():
    response = client.get("/", follow_redirects=False)
    assert response.status_code == 307  # Temporary Redirect
    assert response.headers["location"] == "/docs"


def test_root_redirect_follows():
    response = client.get("/", follow_redirects=True)
    assert response.status_code == 200
    assert "Swagger UI" in response.text
