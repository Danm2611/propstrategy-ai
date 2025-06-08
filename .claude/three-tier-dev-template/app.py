from flask import Flask, render_template, jsonify
import os
import redis
from datetime import datetime

app = Flask(__name__)

# Redis connection (for caching/background tasks)
try:
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
    r = redis.from_url(redis_url)
except:
    r = None

@app.route('/')
def index():
    environment = os.getenv('ENVIRONMENT', 'localhost')
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    return render_template('index.html', 
                         environment=environment,
                         current_time=current_time)

@app.route('/health')
def health_check():
    redis_status = "connected" if r and r.ping() else "disconnected"
    
    return jsonify({
        'status': 'healthy',
        'environment': os.getenv('ENVIRONMENT', 'localhost'),
        'redis': redis_status,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/test')
def api_test():
    return jsonify({
        'message': 'API is working!',
        'environment': os.getenv('ENVIRONMENT', 'localhost')
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)