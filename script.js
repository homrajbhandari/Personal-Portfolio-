const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-item a");
const mainContent = document.querySelector(".main-content");
const contactForm = document.getElementById("contactForm");
const typingText = document.querySelector(".typing-text");
const workCountSection = document.getElementById("work-count");

// Toggle sidebar
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("active");
  document.body.classList.toggle("sidebar-open");
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    }
  });
});

document.addEventListener("click", (e) => {
  if (window.innerWidth <= 768) {
    if (
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target) &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    }
  }
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");

    if (targetId === "#hero") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offset = 80;
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: "smooth",
        });
      }
    }

    sidebarLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");

    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    }
  });
});

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      sidebarLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  if (scrollPosition < 100) {
    sidebarLinks.forEach((link) => link.classList.remove("active"));
    if (sidebarLinks[0]) {
      sidebarLinks[0].classList.add("active");
    }
  }
});

// typing effect

if (typingText) {
  const texts = [
    "Computer Engineer",
    "Full Stack Developer",
    "AI Enthusiast",
    "Problem Solver",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let deletingSpeed = 50;
  let pauseTime = 1500;

  function typeEffect() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = deletingSpeed;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = pauseTime;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  setTimeout(typeEffect, 1000);
}

// counter animation

function animateCounter() {
  const counters = document.querySelectorAll(".count-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const increment = target / 200;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current);
        setTimeout(updateCounter, 10);
      } else {
        counter.textContent = target + "+";
      }
    };

    updateCounter();
  });
}

if (workCountSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(workCountSection);
}

// Form Submission

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "User";

    showNotification(
      `Thank you for your message, ${name}! I will get back to you soon.`,
      "success",
    );

    contactForm.reset();
  });
}

// Helper function

function showNotification(message, type = "success") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: #4CAF50;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
      }
      .notification-error { background: #f44336; }
      .notification-warning { background: #ff9800; }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    });

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Initilize

window.addEventListener("DOMContentLoaded", () => {
  if (sidebarLinks[0]) {
    sidebarLinks[0].classList.add("active");
  }

  initializeSkillBars();
});

// skill bar animation

function initializeSkillBars() {
  const skillBars = document.querySelectorAll(".skill-level");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target;
          const width = skillBar.style.width;

          // Reset width to 0 for animation
          skillBar.style.width = "0%";

          setTimeout(() => {
            skillBar.style.width = width;
          }, 100);

          skillObserver.unobserve(skillBar);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
}

// Res[onsive sidebar

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.add("active");
    document.body.classList.remove("sidebar-open");
  } else {
    if (!document.body.classList.contains("sidebar-open")) {
      sidebar.classList.remove("active");
    }
  }
});

if (window.innerWidth > 768) {
  sidebar.classList.add("active");
}

// smooth page load

window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// scroll to top button

function createScrollToTopButton() {
  const scrollButton = document.createElement("button");
  scrollButton.id = "scroll-to-top";
  scrollButton.innerHTML = "↑";
  scrollButton.title = "Back to top";

  const style = document.createElement("style");
  style.textContent = `
    #scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 99;
      box-shadow: 0 4px 15px rgba(106, 130, 251, 0.3);
    }
    #scroll-to-top.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    #scroll-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(106, 130, 251, 0.4);
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(scrollButton);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollButton.classList.add("show");
    } else {
      scrollButton.classList.remove("show");
    }
  });

  scrollButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

createScrollToTopButton();
