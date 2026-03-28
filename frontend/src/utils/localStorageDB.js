const USERS_KEY = 'p2p_users';
const FOODS_KEY = 'p2p_foods';

// Helpers
const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const getFoods = () => JSON.parse(localStorage.getItem(FOODS_KEY) || '[]');
const saveFoods = (foods) => localStorage.setItem(FOODS_KEY, JSON.stringify(foods));

function haversineDistance(coords1, coords2) {
    function toRad(x) { return x * Math.PI / 180; }
    const lon1 = coords1[0]; const lat1 = coords1[1];
    const lon2 = coords2[0]; const lat2 = coords2[1];
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
}

// API Emulators
export const registerUser = async ({ name, email, password, role }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                return reject({ response: { data: { msg: 'User already exists' } } });
            }
            const newUser = {
                id: Date.now().toString(),
                name, email, password, // storing raw password locally for purely client-side MVP
                role: role || 'receiver',
                totalDonations: 0, points: 0, badges: [], rating: 0,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            saveUsers(users);
            
            // Simulating JWT token behavior
            const mockToken = 'local-token-' + newUser.id;
            resolve({ data: { token: mockToken, user: newUser } });
        }, 300);
    });
};

export const loginUser = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                return reject({ response: { data: { msg: 'Invalid Credentials' } } });
            }
            const mockToken = 'local-token-' + user.id;
            resolve({ data: { token: mockToken, user } });
        }, 300);
    });
};

export const postFood = async (foodData, userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const foods = getFoods();
            const newFood = {
                _id: Date.now().toString(),
                donor_id: userId,
                status: 'available',
                claimed_by: null,
                createdAt: new Date().toISOString(),
                ...foodData // contains food_name, quantity, category, address, location(Object), expiry_time, image_url(base64)
            };
            foods.push(newFood);
            saveFoods(foods);

            // Update user gamification
            const users = getUsers();
            const uIndex = users.findIndex(u => u.id === userId);
            if (uIndex !== -1) {
                users[uIndex].totalDonations += 1;
                users[uIndex].points += 10;
                if (users[uIndex].totalDonations >= 5 && !users[uIndex].badges.includes('Hunger Hero')) {
                    users[uIndex].badges.push('Hunger Hero');
                }
                saveUsers(users);
                
                // Update active local session if needed (AuthContext currently relies entirely on `user` state, but logging out/in fetches standard, or we just trust next reload)
            }

            resolve({ data: newFood });
        }, 500);
    });
};

const enrichFoodWithDonorState = (food, users) => {
    const donor = users.find(u => u.id === food.donor_id);
    return {
        ...food,
        donor_id: donor ? { name: donor.name, email: donor.email, badges: donor.badges, address: food.address } : null
    };
};

export const getAvailableFoods = async (filters = {}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const foods = getFoods();
            const users = getUsers();
            const now = new Date();

            let results = foods.filter(f => f.status === 'available' && new Date(f.expiry_time) > now);

            if (filters.category) {
                results = results.filter(f => f.category === filters.category);
            }

            if (filters.lng && filters.lat) {
                const userCoords = [parseFloat(filters.lng), parseFloat(filters.lat)];
                const distLimit = parseInt(filters.maxDistance || 50000);
                results = results.filter(f => {
                    const dist = haversineDistance(f.location.coordinates, userCoords);
                    return dist <= distLimit;
                });
            }

            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            results = results.map(f => enrichFoodWithDonorState(f, users));
            
            resolve({ data: results });
        }, 300);
    });
};

export const bookFood = async (foodId, userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foods = getFoods();
            const index = foods.findIndex(f => f._id === foodId);
            if (index === -1) return reject({ response: { data: { msg: 'Food not found' } } });
            
            const food = foods[index];
            if (food.status !== 'available') return reject({ response: { data: { msg: 'Food already booked or claimed' } } });
            if (food.donor_id === userId) return reject({ response: { data: { msg: 'Cannot book your own donation' } } });

            food.status = 'booked';
            food.booked_by = userId; // Note: using claimed_by for booked_by temporarily allows existing dashboard logic to still display it, but we'll use booked_by for clarity and set both.
            food.claimed_by = userId; 
            saveFoods(foods);
            
            resolve({ data: food });
        }, 300);
    });
};

export const claimFood = async (foodId, userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foods = getFoods();
            const index = foods.findIndex(f => f._id === foodId);
            if (index === -1) return reject({ response: { data: { msg: 'Food not found' } } });
            
            const food = foods[index];
            // Food must be booked by this user first
            if (food.status !== 'booked' || food.claimed_by !== userId) {
                return reject({ response: { data: { msg: 'You must book this food before final claiming' } } });
            }

            food.status = 'claimed';
            // User gamification logic was already increased on post.
            saveFoods(foods);
            
            resolve({ data: food });
        }, 300);
    });
};

export const removeFood = async (foodId, userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let foods = getFoods();
            const food = foods.find(f => f._id === foodId);
            
            if (!food) return reject({ response: { data: { msg: 'Food not found' } } });
            if (food.donor_id !== userId) return reject({ response: { data: { msg: 'Unauthorized to delete this post' } } });
            if (food.status === 'claimed') return reject({ response: { data: { msg: 'Cannot delete a finalized claim' } } });

            // Keep only foods that dont match the ID
            foods = foods.filter(f => f._id !== foodId);
            saveFoods(foods);

            // Penalize gamification points for deleting (Optional but fair)
            const users = getUsers();
            const uIndex = users.findIndex(u => u.id === userId);
            if (uIndex !== -1) {
                if (users[uIndex].points >= 10) users[uIndex].points -= 10;
                if (users[uIndex].totalDonations > 0) users[uIndex].totalDonations -= 1;
                // If they dip below 5 donos, remove badge (pure logic choice)
                if (users[uIndex].totalDonations < 5) {
                    users[uIndex].badges = users[uIndex].badges.filter(b => b !== 'Hunger Hero');
                }
                saveUsers(users);
            }

            resolve({ data: { success: true } });
        }, 300);
    });
};

export const getDashboard = async (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const foods = getFoods();
            const users = getUsers();

            let posted = foods.filter(f => f.donor_id === userId);
            posted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            posted = posted.map(f => enrichFoodWithDonorState(f, users));

            let claimed = foods.filter(f => f.claimed_by === userId);
            claimed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            claimed = claimed.map(f => enrichFoodWithDonorState(f, users));

            const u = users.find(usr => usr.id === userId);
            const userStats = u ? { points: u.points, badges: u.badges, totalDonations: u.totalDonations } : null;

            resolve({ data: { posted, claimed, userStats } });
        }, 300);
    });
};

export const getAnalytics = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getUsers();
            const foods = getFoods();
            const now = new Date();

            resolve({
                data: {
                    totalUsers: users.length,
                    totalSaved: foods.filter(f => f.status === 'claimed').length,
                    activeListings: foods.filter(f => f.status === 'available' && new Date(f.expiry_time) > now).length,
                    platformPoints: users.reduce((acc, crr) => acc + (crr.points || 0), 0),
                    totalPlatformDonations: users.reduce((acc, crr) => acc + (crr.totalDonations || 0), 0)
                }
            });
        }, 300);
    });
};
