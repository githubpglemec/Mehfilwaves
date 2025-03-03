document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const optionsBtn = document.getElementById('optionsBtn');
    const timeDisplay = document.getElementById('timeDisplay');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.querySelector('.progress-container');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeRange = document.getElementById('volumeRange');
    const bgVideo = document.getElementById('bg-video');
    const visualizerBars = document.querySelectorAll('.bar');
    
    // Initial state
    let isPlaying = false;
    let volumeVisible = false;
    
    // Fix: Don't start at 40 seconds by default - start from beginning (or specific time if needed)
    audioPlayer.currentTime = 0; // Start from beginning
    
    // Function to format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Play/Pause functionality
    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
            playBtn.textContent = '▶';
            // Pause visualization
            visualizerBars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        } else {
            audioPlayer.play();
            playBtn.textContent = '⏸';
            // Resume visualization
            visualizerBars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        }
        isPlaying = !isPlaying;
    }
    
    // Update progress as audio plays
    function updateProgress() {
        const duration = audioPlayer.duration || 336; // 5:36 in seconds
        const currentTime = audioPlayer.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        
        // Update progress bar
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    
    // Skip to position in audio when clicked on progress bar
    function setProgress(e) {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration || 336;
        audioPlayer.currentTime = (clickX / width) * duration;
        updateProgress();
    }
    
    // Toggle volume slider visibility
    function toggleVolumeSlider() {
        volumeVisible = !volumeVisible;
        volumeSlider.style.display = volumeVisible ? 'block' : 'none';
    }
    
    // Set volume based on slider
    function setVolume() {
        audioPlayer.volume = volumeRange.value / 100;
        
        // Update volume icon based on level
        if (audioPlayer.volume === 0) {
            volumeBtn.textContent = '🔇';
        } else if (audioPlayer.volume < 0.5) {
            volumeBtn.textContent = '🔉';
        } else {
            volumeBtn.textContent = '🔊';
        }
    }
    
    // Toggle mute
    function toggleMute() {
        if (!volumeVisible) {
            audioPlayer.muted = !audioPlayer.muted;
            volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
        }
    }
    
    // Animate audio visualizer
    function animateVisualizer(isPlaying) {
        visualizerBars.forEach(bar => {
            bar.style.animationPlayState = isPlaying ? 'running' : 'paused';
        });
    }
    
    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeBtn.addEventListener('click', (e) => {
        toggleVolumeSlider();
        e.stopPropagation(); // Prevent body click from immediately hiding slider
    });
    volumeRange.addEventListener('input', setVolume);
    volumeBtn.addEventListener('dblclick', toggleMute);
    
    // Initial animation state (paused)
    animateVisualizer(false);
    
    // Hide volume slider when clicking elsewhere
    document.body.addEventListener('click', (e) => {
        if (volumeVisible && e.target !== volumeBtn && e.target !== volumeRange) {
            volumeVisible = false;
            volumeSlider.style.display = 'none';
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll on spacebar
            togglePlay();
        } else if (e.code === 'ArrowUp') {
            volumeRange.value = Math.min(parseInt(volumeRange.value) + 10, 100);
            setVolume();
        } else if (e.code === 'ArrowDown') {
            volumeRange.value = Math.max(parseInt(volumeRange.value) - 10, 0);
            setVolume();
        } else if (e.code === 'KeyM') {
            toggleMute();
        }
    });
    
    // Handle looping
    audioPlayer.addEventListener('ended', () => {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    });
    
    // Make player responsive
    window.addEventListener('resize', () => {
        // Update layout if needed
        updateProgress();
    });
    
    // Handle metadata loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        // Update initial time display
        updateProgress();
    });
    
    // Initialize with proper display
    updateProgress();
    
    // Optional: preload audio metadata
    audioPlayer.preload = 'metadata';
});