function Timer(callback, timeInterval, options = {}) {
  this.timeInterval = timeInterval;
  this.timeout = null;
  this.expected = null;

  // Start the timer
  this.start = () => {
      this.expected = Date.now() + this.timeInterval;
      
      // If immediate is true, execute the callback immediately
      if (options.immediate) {
          callback();
      }
      
      // Start the round cycle
      this.timeout = setTimeout(this.round, this.timeInterval);
      console.log('Timer Started');
  };

  // Stop the timer
  this.stop = () => {
      clearTimeout(this.timeout);
      console.log('Timer Stopped');
  };

  // Round method that runs on each timeout
  this.round = () => {
      let drift = Date.now() - this.expected; // Measure drift
      if (drift > this.timeInterval) {
          // If drift exceeds the time interval, invoke error callback (if provided)
          if (options.errorCallback) {
              options.errorCallback();
          }
      }
      
      callback(); // Run the callback
      this.expected += this.timeInterval; // Adjust expected time

      // Adjust for drift and schedule the next round
      this.timeout = setTimeout(this.round, this.timeInterval - drift);
      console.log('Drift:', drift);
      console.log('Next round time interval:', this.timeInterval - drift);
  };
}

export default Timer;
