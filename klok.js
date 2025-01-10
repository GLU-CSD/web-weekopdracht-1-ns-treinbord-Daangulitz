function updateClock() {
    // gets new date
    const now = new Date();

    // in new date gets every time that he needs 
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const hourDeg = (hour % 12) * 30 + minute * 0.5; // 360° / 12 hours
    const minuteDeg = minute * 6; // 360° / 60 minutes
    const secondDeg = second * 6; // 360° / 60 seconds

    // zet de id elements in een style to rotate
    document.getElementById('hour').style.transform = `rotate(${hourDeg}deg)`;
    document.getElementById('minute').style.transform = `rotate(${minuteDeg}deg)`;
    document.getElementById('second').style.transform = `rotate(${secondDeg}deg)`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initialize clock
updateClock();