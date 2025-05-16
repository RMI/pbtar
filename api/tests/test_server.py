from fastapi.testclient import TestClient
from pbtar_api import create_app
from pbtar_api.services.auth import get_api_key

app = create_app(title="foo", description="bar", version="baz")


def override_get_api_key():
    return True


app.dependency_overrides[get_api_key] = override_get_api_key

client = TestClient(app, base_url="http://testserver")


def test_root_redirects():
    response = client.get("/", follow_redirects=False)
    assert response.status_code == 307  # Temporary Redirect
    assert response.headers["location"] == "/docs"


def test_root_redirect_follows():
    response = client.get("/", follow_redirects=True)
    assert response.status_code == 200
    assert "Swagger UI" in response.text


def test_health_check():
    response = client.get("/health", follow_redirects=False)
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_health_check_redirect():
    response = client.get("/health/", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"] == "http://testserver/health"


def test_bad_request():
    response = client.get("/xxx")
    assert response.status_code == 404
