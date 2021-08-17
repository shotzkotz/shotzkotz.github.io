function eventHandler(player) {
    let touchX = null;
    let touchY = null;

    document.addEventListener("touchstart", function(event) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
    });

    document.addEventListener("touchmove", function(event) {
        if (!touchX || !touchY || (window.innerWidth > window.innerHeight)) {
            return;
        }

        let touchDiffX = touchX - event.touches[0].clientX;
        let touchDiffY = touchY - event.touches[0].clientY;

        if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
            if (touchDiffX > 0) {
                player.move("left");
            } else {
                player.move("right")
            } 
        }

        touchX = null;
        touchY = null; 
    });
}
