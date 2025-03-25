document.addEventListener('DOMContentLoaded', function() {
    const authPage = document.getElementById('auth-page');
    const userPage = document.getElementById('user-page');
    const loginBtn = document.getElementById('login-btn');
    const generateKeyBtn = document.getElementById('generate-key-btn');
    const generateNewKeyBtn = document.getElementById('generate-new-key-btn');
    const robloxUsernameInput = document.getElementById('roblox-username');
    const robloxPasswordInput = document.getElementById('roblox-password');
    const keyOptions = document.querySelector('.key-options');
    const captchaContainer = document.getElementById('captcha-container');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const currentKey = document.getElementById('current-key');
    const timeRemaining = document.getElementById('time-remaining');
    
    let userData = null;
    
    loginBtn.addEventListener('click', function() {
        const username = robloxUsernameInput.value.trim();
        const password = robloxPasswordInput.value.trim();
        
        if (!username || !password) {
            alert('Please enter your Roblox username and password');
            return;
        }
        
        captchaContainer.style.display = 'block';
        
        fetchUser(username, password)
            .then(user => {
                userData = user;
                keyOptions.style.display = 'block';
                return user;
            })
            .then(user => {
                userPage.style.display = 'block';
                authPage.style.display = 'none';
                
                userAvatar.src = user.avatar;
                userName.textContent = user.username;
                
                generateKey(user);
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                alert('Failed to fetch user information');
            });
    });
    
    generateKeyBtn.addEventListener('click', function() {
        if (!userData) {
            alert('User data not found');
            return;
        }
        
        const duration = document.querySelector('input[name="key-duration"]:checked').value;
        generateKey(userData, duration);
    });
    
    generateNewKeyBtn.addEventListener('click', function() {
        if (!userData) {
            alert('User data not found');
            return;
        }
        
        userPage.style.display = 'none';
        authPage.style.display = 'block';
        keyOptions.style.display = 'none';
        captchaContainer.style.display = 'none';
    });
    
    function fetchUser(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    username: username,
                    avatar: `https://thumbnails.roblox.com/v1/users/avatar?userId=${Math.floor(Math.random() * 1000000)}&size=420x420&format=Png`,
                    key: null,
                    expires: null
                });
            }, 1000);
        });
    }
    
    function generateKey(user, duration = '1') {
        const key = `SansHub_${generateRandomString(8)}`;
        const now = new Date();
        let expires;
        
        if (duration === '1') {
            expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else {
            expires = new Date(now.getTime() + 72 * 60 * 60 * 1000);
        }
        
        userData = {
            ...userData,
            key: key,
            expires: expires.toISOString()
        };
        
        currentKey.textContent = key;
        updateTimer(expires);
        
        setInterval(() => {
            updateTimer(expires);
        }, 1000);
        
        saveKeyToServer(userData);
    }
    
    function updateTimer(expires) {
        const now = new Date();
        const diff = expires - now;
        
        if (diff <= 0) {
            timeRemaining.textContent = 'Expired';
            return;
        }
        
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timeRemaining.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    function saveKeyToServer(userData) {
        console.log('Saving key to server:', userData);
    }
});
