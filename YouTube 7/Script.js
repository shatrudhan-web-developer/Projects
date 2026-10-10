function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// Enhanced hover effects for individual dock icons
document.addEventListener("DOMContentLoaded", function () {
  const dockIcons = document.querySelectorAll(".dock-icon");

  dockIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });

    // Individual icon click handlers (if needed)
    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      // Add specific functionality for each icon here if needed
      console.log(`Clicked on ${this.alt}`);
    });
  });

  // Add subtle animation to glass effects
  const glassElements = document.querySelectorAll(".glass-effect");

  glassElements.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const highlight = this.querySelector(".glass-highlight");
      if (highlight) {
        highlight.style.boxShadow = `
                            inset 3px 3px 2px 0 rgba(255, 255, 255, 0.6), 
                            inset -2px -2px 2px 1px rgba(255, 255, 255, 0.6)
                        `;
      }
    });

    element.addEventListener("mouseleave", function () {
      const highlight = this.querySelector(".glass-highlight");
      if (highlight) {
        highlight.style.boxShadow = `
                            inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), 
                            inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)
                        `;
      }
    });
  });
});

// Handle window resize for responsive behavior
window.addEventListener("resize", function () {
  // Adjust any dynamic sizing if needed
});
