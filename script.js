




document.addEventListener("DOMContentLoaded", function () {

  

    const searchInput = document.getElementById("eventSearch");

    const clubFilter =
        document.getElementById("clubFilter");

    const departmentFilter =
        document.getElementById("departmentFilter");

    



    let eventItems =
        document.querySelectorAll(".event-item");

    if (eventItems.length === 0) {
        eventItems =
            document.querySelectorAll(".event-card");
    }


    function filterEvents() {

        const searchValue =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const selectedClub =
            clubFilter
                ? clubFilter.value.toLowerCase()
                : "all";

        const selectedDepartment =
            departmentFilter
                ? departmentFilter.value.toLowerCase()
                : "all";


        eventItems.forEach(function (eventItem) {

            const eventText =
                eventItem.textContent.toLowerCase();


           



            const eventClub =
                (eventItem.dataset.club || "").toLowerCase();

            const eventDepartment =
                (eventItem.dataset.department || "").toLowerCase();


            const matchesSearch =
                eventText.includes(searchValue);


            const matchesClub =
                selectedClub === "all" ||
                selectedClub === "" ||
                eventClub === selectedClub;


            const matchesDepartment =
                selectedDepartment === "all" ||
                selectedDepartment === "" ||
                eventDepartment === selectedDepartment;


            if (
                matchesSearch &&
                matchesClub &&
                matchesDepartment
            ) {

                eventItem.classList.remove("d-none");

            } else {

                eventItem.classList.add("d-none");
            }

        });


        updateNoResultsMessage();
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterEvents
        );
    }


    if (clubFilter) {

        clubFilter.addEventListener(
            "change",
            filterEvents
        );
    }


    if (departmentFilter) {

        departmentFilter.addEventListener(
            "change",
            filterEvents
        );
    }


    /*  NO RESULTS MESSAGE */

    function updateNoResultsMessage() {

        const eventContainer =
            document.querySelector(
                "#eventGrid, .event-grid, .events-grid"
            );

        if (!eventContainer) {
            return;
        }


        const visibleEvents =
            Array.from(eventItems).filter(function (item) {

                return !item.classList.contains("d-none");

            });


        let noResults =
            document.getElementById("noEventsMessage");


        if (visibleEvents.length === 0) {

            if (!noResults) {

                noResults =
                    document.createElement("div");

                noResults.id =
                    "noEventsMessage";

                noResults.className =
                    "alert alert-info text-center mt-4";

                noResults.innerHTML =
                    `
                    <i class="bi bi-calendar-x me-2"></i>
                    No events match your search or filters.
                    `;

                eventContainer.appendChild(noResults);
            }

        } else {

            if (noResults) {
                noResults.remove();
            }
        }
    }


    /*  RESET FILTERS */

    const resetButtons =
        document.querySelectorAll(
            "#resetFilters, .reset-filters, [data-reset-filters]"
        );


    resetButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (clubFilter) {
                    clubFilter.value = "all";
                }

                if (departmentFilter) {
                    departmentFilter.value = "all";
                }

                filterEvents();

                showCampusToast(
                    "Event filters have been reset.",
                    "info"
                );
            }
        );
    });


    /* =====================================================
       4. REGISTRATION MODAL
       ===================================================== */

    const registrationModal =
        document.getElementById("registrationModal");


    if (registrationModal) {

        registrationModal.addEventListener(
            "show.bs.modal",
            function (event) {

                const button =
                    event.relatedTarget;


                if (!button) {
                    return;
                }


                /*
                   Read event name from:

                   data-event="CodeSprint 2026"
                */

                const eventName =
                    button.getAttribute("data-event");


                const selectedEventName =
                    document.getElementById(
                        "selectedEventName"
                    );


                if (
                    selectedEventName &&
                    eventName
                ) {

                    selectedEventName.textContent =
                        eventName;
                }


                /*
                   Also put the event name into a hidden
                   input if one exists.
                */

                const hiddenEventInput =
                    registrationModal.querySelector(
                        'input[name="event"], input[name="eventName"]'
                    );


                if (
                    hiddenEventInput &&
                    eventName
                ) {

                    hiddenEventInput.value =
                        eventName;
                }
            }
        );
    }


    /* =====================================================
       5. REGISTRATION FORM
       ===================================================== */

    const registrationForm =
        document.getElementById(
            "registrationForm"
        );


    if (registrationForm) {

        registrationForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const requiredFields =
                    registrationForm.querySelectorAll(
                        "input[required], select[required], textarea[required]"
                    );


                let valid = true;


                requiredFields.forEach(
                    function (field) {

                        if (
                            field.value.trim() === ""
                        ) {

                            field.classList.add(
                                "is-invalid"
                            );

                            valid = false;

                        } else {

                            field.classList.remove(
                                "is-invalid"
                            );

                            field.classList.add(
                                "is-valid"
                            );
                        }
                    }
                );


                if (!valid) {

                    showCampusToast(
                        "Please complete all required fields.",
                        "danger"
                    );

                    return;
                }


                /*
                   Basic email validation
                */

                const emailInput =
                    registrationForm.querySelector(
                        'input[type="email"]'
                    );


                if (
                    emailInput &&
                    !isValidEmail(emailInput.value)
                ) {

                    emailInput.classList.add(
                        "is-invalid"
                    );

                    showCampusToast(
                        "Please enter a valid email address.",
                        "danger"
                    );

                    return;
                }


                showCampusToast(
                    "🎉 Registration successful!",
                    "success"
                );


                /*
                   Close Bootstrap modal
                */

                if (registrationModal) {

                    const modal =
                        bootstrap.Modal.getInstance(
                            registrationModal
                        );


                    if (modal) {
                        modal.hide();
                    }
                }


                /*
                   Reset form after successful
                   registration.
                */

                setTimeout(function () {

                    registrationForm.reset();

                    registrationForm
                        .querySelectorAll(
                            ".is-valid, .is-invalid"
                        )
                        .forEach(function (field) {

                            field.classList.remove(
                                "is-valid",
                                "is-invalid"
                            );

                        });

                }, 300);

            }
        );
    }


    /* =====================================================
       6. LOGIN FORM
       ===================================================== */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const emailInput =
                    loginForm.querySelector(
                        'input[type="email"]'
                    );


                const passwordInput =
                    loginForm.querySelector(
                        'input[type="password"]'
                    );


                if (
                    !emailInput ||
                    !passwordInput
                ) {
                    return;
                }


                const email =
                    emailInput.value.trim();


                const password =
                    passwordInput.value.trim();


                /*
                   Empty field validation
                */

                if (
                    email === "" ||
                    password === ""
                ) {

                    showCampusToast(
                        "Please enter your email and password.",
                        "danger"
                    );

                    return;
                }


                /*
                   Email validation
                */

                if (!isValidEmail(email)) {

                    showCampusToast(
                        "Please enter a valid student email address.",
                        "danger"
                    );

                    emailInput.focus();

                    return;
                }


                /*
                   Password validation
                */

                if (password.length < 6) {

                    showCampusToast(
                        "Password must contain at least 6 characters.",
                        "danger"
                    );

                    passwordInput.focus();

                    return;
                }


                showCampusToast(
                    "Login form submitted successfully! ✅",
                    "success"
                );


                
                
            }
        );
    }


    /* =====================================================
       7. SIGNUP FORM
       ===================================================== */

    const signupForm =
        document.getElementById("signupForm");


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const passwordInputs =
                    signupForm.querySelectorAll(
                        'input[type="password"]'
                    );


                const requiredFields =
                    signupForm.querySelectorAll(
                        "input[required], select[required]"
                    );


                let valid = true;


                requiredFields.forEach(
                    function (field) {

                        if (
                            field.value.trim() === ""
                        ) {

                            field.classList.add(
                                "is-invalid"
                            );

                            valid = false;

                        } else {

                            field.classList.remove(
                                "is-invalid"
                            );
                        }
                    }
                );


                if (!valid) {

                    showCampusToast(
                        "Please complete all required fields.",
                        "danger"
                    );

                    return;
                }


                /*
                   Check password confirmation
                   when two password fields exist.
                */

                if (
                    passwordInputs.length >= 2
                ) {

                    const password =
                        passwordInputs[0].value;


                    const confirmPassword =
                        passwordInputs[1].value;


                    if (
                        password !==
                        confirmPassword
                    ) {

                        passwordInputs[1]
                            .classList.add(
                                "is-invalid"
                            );

                        showCampusToast(
                            "Passwords do not match.",
                            "danger"
                        );

                        return;
                    }
                }


                showCampusToast(
                    "🎉 Account created successfully!",
                    "success"
                );


                setTimeout(function () {

                    signupForm.reset();

                    signupForm
                        .querySelectorAll(
                            ".is-valid, .is-invalid"
                        )
                        .forEach(function (field) {

                            field.classList.remove(
                                "is-valid",
                                "is-invalid"
                            );

                        });

                }, 500);

            }
        );
    }


    /* =====================================================
       8. PASSWORD SHOW / HIDE
       ===================================================== */

    const passwordInputs =
        document.querySelectorAll(
            'input[type="password"]'
        );


    passwordInputs.forEach(
        function (input) {

            /*
               Prevent duplicate eye buttons.
            */

            if (
                input.parentElement.querySelector(
                    ".password-toggle"
                )
            ) {
                return;
            }


            const wrapper =
                input.parentElement;


            wrapper.style.position =
                "relative";


            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "password-toggle btn btn-sm";

            button.innerHTML =
                '<i class="bi bi-eye"></i>';

            button.setAttribute(
                "aria-label",
                "Show password"
            );


            button.style.position =
                "absolute";

            button.style.right =
                "10px";

            button.style.top =
                "50%";

            button.style.transform =
                "translateY(-50%)";

            button.style.border =
                "none";

            button.style.background =
                "transparent";

            button.style.zIndex =
                "5";


            wrapper.appendChild(button);


            button.addEventListener(
                "click",
                function () {

                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.innerHTML =
                            '<i class="bi bi-eye-slash"></i>';

                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    } else {

                        input.type =
                            "password";

                        button.innerHTML =
                            '<i class="bi bi-eye"></i>';

                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       9. FAVORITE EVENT BUTTONS
       ===================================================== */

    eventItems.forEach(
        function (card) {

            /*
               Prevent duplicate favorite buttons.
            */

            if (
                card.querySelector(
                    ".favorite-btn"
                )
            ) {
                return;
            }


            const favoriteButton =
                document.createElement("button");


            favoriteButton.type =
                "button";


            favoriteButton.className =
                "btn btn-sm btn-outline-secondary favorite-btn";


            favoriteButton.innerHTML =
                '<i class="bi bi-heart"></i>';


            favoriteButton.title =
                "Add to favorites";


            favoriteButton.setAttribute(
                "aria-label",
                "Add event to favorites"
            );


            favoriteButton.style.borderRadius =
                "50%";


            /*
               card event ke ander suitable location find krne k liye
            */

            const cardBody =
                card.querySelector(
                    ".card-body"
                );


            const target =
                cardBody || card;


            target.style.position =
                "relative";


            favoriteButton.style.position =
                "absolute";

            favoriteButton.style.top =
                "15px";

            favoriteButton.style.right =
                "15px";


            target.appendChild(
                favoriteButton
            );


            favoriteButton.addEventListener(
                "click",
                function () {

                    const icon =
                        favoriteButton.querySelector(
                            "i"
                        );


                    const active =
                        favoriteButton.classList.toggle(
                            "active"
                        );


                    if (active) {

                        icon.classList.remove(
                            "bi-heart"
                        );

                        icon.classList.add(
                            "bi-heart-fill"
                        );


                        favoriteButton.title =
                            "Remove from favorites";


                        favoriteButton.setAttribute(
                            "aria-label",
                            "Remove event from favorites"
                        );


                        showCampusToast(
                            "❤️ Event added to favorites.",
                            "success"
                        );

                    } else {

                        icon.classList.remove(
                            "bi-heart-fill"
                        );

                        icon.classList.add(
                            "bi-heart"
                        );


                        favoriteButton.title =
                            "Add to favorites";


                        favoriteButton.setAttribute(
                            "aria-label",
                            "Add event to favorites"
                        );


                        showCampusToast(
                            "Event removed from favorites.",
                            "info"
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       10. CREATE EVENT FORM
       ===================================================== */

    const createEventForm =
        document.getElementById(
            "createEventForm"
        );


    if (createEventForm) {

        createEventForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const requiredFields =
                    createEventForm.querySelectorAll(
                        "input[required], select[required], textarea[required]"
                    );


                let valid = true;


                requiredFields.forEach(
                    function (field) {

                        if (
                            field.value.trim() === ""
                        ) {

                            field.classList.add(
                                "is-invalid"
                            );

                            valid = false;

                        } else {

                            field.classList.remove(
                                "is-invalid"
                            );
                        }
                    }
                );


                if (!valid) {

                    showCampusToast(
                        "Please complete all required event details.",
                        "danger"
                    );

                    return;
                }


                showCampusToast(
                    "🎉 Event created successfully!",
                    "success"
                );


                createEventForm.reset();
            }
        );
    }


    /* =====================================================
       11. EVENT DATE VALIDATION
       ===================================================== */

    const eventDateInputs =
        document.querySelectorAll(
            'input[type="date"]'
        );


    eventDateInputs.forEach(
        function (input) {

            /*
               Only apply future-date restriction
               to organizer/create-event forms.
            */

            const insideCreateForm =
                input.closest(
                    "#createEventForm"
                );


            if (!insideCreateForm) {
                return;
            }


            const today =
                new Date();


            const year =
                today.getFullYear();


            const month =
                String(
                    today.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    today.getDate()
                ).padStart(2, "0");


            input.min =
                `${year}-${month}-${day}`;
        }
    );


    /* =====================================================
       12. EVENT DESCRIPTION CHARACTER COUNTER
       ===================================================== */

    const descriptionInputs =
        document.querySelectorAll(
            "#eventDescription, textarea[name='description']"
        );


    descriptionInputs.forEach(
        function (textarea) {

            if (
                textarea.dataset.counterAdded ===
                "true"
            ) {
                return;
            }


            textarea.dataset.counterAdded =
                "true";


            const counter =
                document.createElement("small");


            counter.className =
                "text-muted d-block mt-1";


            textarea.parentElement.appendChild(
                counter
            );


            function updateCounter() {

                const length =
                    textarea.value.length;


                counter.textContent =
                    `${length} characters`;


                if (length > 500) {

                    counter.classList.remove(
                        "text-muted"
                    );

                    counter.classList.add(
                        "text-danger"
                    );

                } else {

                    counter.classList.remove(
                        "text-danger"
                    );

                    counter.classList.add(
                        "text-muted"
                    );
                }
            }


            textarea.addEventListener(
                "input",
                updateCounter
            );


            updateCounter();
        }
    );


    /* =====================================================
       13. DELETE EVENT CONFIRMATION
       ===================================================== */

    const deleteButtons =
        document.querySelectorAll(
            ".delete-event, .btn-delete, [data-action='delete']"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this event?"
                        );


                    if (!confirmed) {

                        event.preventDefault();

                        showCampusToast(
                            "Event deletion cancelled.",
                            "info"
                        );

                        return;
                    }


                    showCampusToast(
                        "Event deleted successfully.",
                        "success"
                    );
                }
            );
        }
    );


    /* =====================================================
       14. EDIT EVENT BUTTONS
       ===================================================== */

    const editButtons =
        document.querySelectorAll(
            ".edit-event, .btn-edit, [data-action='edit']"
        );


    editButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                       Prevent a dummy link/button
                       from jumping to another page.
                    */

                    if (
                        button.tagName === "A" &&
                        button.getAttribute("href") === "#"
                    ) {

                        event.preventDefault();
                    }


                    showCampusToast(
                        "Edit mode is ready. Backend storage can be connected later.",
                        "info"
                    );
                }
            );
        }
    );


    /* =====================================================
       15. SCROLL-TO-TOP BUTTON
       ===================================================== */

    const scrollTopButton =
        document.createElement("button");


    scrollTopButton.type =
        "button";


    scrollTopButton.className =
        "btn btn-primary scroll-top-btn";


    scrollTopButton.innerHTML =
        '<i class="bi bi-arrow-up"></i>';


    scrollTopButton.title =
        "Back to top";


    scrollTopButton.setAttribute(
        "aria-label",
        "Back to top"
    );


    scrollTopButton.style.position =
        "fixed";


    scrollTopButton.style.bottom =
        "25px";


    scrollTopButton.style.right =
        "25px";


    scrollTopButton.style.width =
        "45px";


    scrollTopButton.style.height =
        "45px";


    scrollTopButton.style.borderRadius =
        "50%";


    scrollTopButton.style.display =
        "none";


    scrollTopButton.style.zIndex =
        "9999";


    document.body.appendChild(
        scrollTopButton
    );


    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY > 400
            ) {

                scrollTopButton.style.display =
                    "block";

            } else {

                scrollTopButton.style.display =
                    "none";
            }
        }
    );


    scrollTopButton.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });
        }
    );


    /* =====================================================
       16. SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });
                    }
                }
            );
        }
    );


    /* =====================================================
       17. AUTOMATIC CURRENT YEAR
       ===================================================== */

    document.querySelectorAll(
        ".current-year"
    ).forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );


    /* =====================================================
       18. BOOTSTRAP TOOLTIP INITIALIZATION
       ===================================================== */

    /*
       Any element containing:

       data-bs-toggle="tooltip"

       will automatically get a Bootstrap tooltip.
    */

    const tooltipElements =
        document.querySelectorAll(
            '[data-bs-toggle="tooltip"]'
        );


    if (
        typeof bootstrap !== "undefined"
    ) {

        tooltipElements.forEach(
            function (element) {

                new bootstrap.Tooltip(
                    element
                );

            }
        );
    }


    /* =====================================================
       19. BOOTSTRAP POPOVER INITIALIZATION
       ===================================================== */

    const popoverElements =
        document.querySelectorAll(
            '[data-bs-toggle="popover"]'
        );


    if (
        typeof bootstrap !== "undefined"
    ) {

        popoverElements.forEach(
            function (element) {

                new bootstrap.Popover(
                    element
                );

            }
        );
    }


    /* =====================================================
       20. UTILITY FUNCTION
       EMAIL VALIDATION
       ===================================================== */

    function isValidEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        return emailPattern.test(email);
    }


    /* =====================================================
       21. CAMPUSPULSE BOOTSTRAP TOAST FUNCTION
       ===================================================== */

    window.showCampusToast =
        function (message, type = "info") {

            /*
               Make sure Bootstrap is available.
            */

            if (
                typeof bootstrap === "undefined"
            ) {

                alert(message);

                return;
            }


            let toastContainer =
                document.getElementById(
                    "campusToastContainer"
                );


            /*
               Create toast container
               only once.
            */

            if (!toastContainer) {

                toastContainer =
                    document.createElement(
                        "div"
                    );


                toastContainer.id =
                    "campusToastContainer";


                toastContainer.className =
                    "toast-container position-fixed top-0 end-0 p-3";


                toastContainer.style.zIndex =
                    "10000";


                document.body.appendChild(
                    toastContainer
                );
            }


            const toast =
                document.createElement(
                    "div"
                );


            toast.className =
                `toast align-items-center text-bg-${type} border-0`;


            toast.setAttribute(
                "role",
                "alert"
            );


            toast.setAttribute(
                "aria-live",
                "assertive"
            );


            toast.setAttribute(
                "aria-atomic",
                "true"
            );


            toast.innerHTML =
                `
                <div class="d-flex">

                    <div class="toast-body">
                        ${message}
                    </div>

                    <button
                        type="button"
                        class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close">
                    </button>

                </div>
                `;


            toastContainer.appendChild(
                toast
            );


            const bootstrapToast =
                new bootstrap.Toast(
                    toast,
                    {
                        delay: 3000
                    }
                );


            bootstrapToast.show();


            toast.addEventListener(
                "hidden.bs.toast",
                function () {

                    toast.remove();

                }
            );
        };


    /* =====================================================
       22. INITIAL FILTER CHECK
       ===================================================== */

    filterEvents();


    /* =====================================================
       JAVASCRIPT INITIALIZATION COMPLETE
       ===================================================== */

    console.log(
        "CampusPulse JavaScript loaded successfully."
    );

});