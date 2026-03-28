async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'receiver'
            })
        });
        const text = await res.text();
        console.log("STATUS:", res.status);
        console.log("BODY:", text);
    } catch (e) {
        console.error("FETCH ERROR:", e.message);
    }
}
run();
