// Global variables
        let currentUser = null;
        let isLoggedIn = false;
        let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || {};
        let currentDate = new Date();
        let selectedDate = new Date();
        let selectedMood = '';

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initializeTheme();
            initializePinInputs();
            checkExistingUser();
            showForm();
        });

        // Theme management
        function initializeTheme() {
            const html = document.documentElement;
            const currentMode = localStorage.getItem('theme') || 'light';
            
            if (currentMode === 'dark') {
                html.classList.add('dark');
            }

            document.getElementById('theme-toggle').addEventListener('click', () => {
                html.classList.toggle('dark');
                const isDark = html.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }

        // Profile dropdown
        document.getElementById('profile-icon').addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('profile-dropdown');
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            document.getElementById('profile-dropdown').classList.remove('show');
        });

        // PIN input functionality
        function initializePinInputs() {
            // Registration form PIN inputs
            const pinInputs = document.querySelectorAll('.pin-digit');
            pinInputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === 1 && index < pinInputs.length - 1) {
                        pinInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                        pinInputs[index - 1].focus();
                    }
                });
            });

            // Current PIN inputs
            const currentPinInputs = document.querySelectorAll('.current-pin-digit');
            currentPinInputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === 1 && index < currentPinInputs.length - 1) {
                        currentPinInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                        currentPinInputs[index - 1].focus();
                    }
                });
            });

            // New PIN inputs
            const newPinInputs = document.querySelectorAll('.new-pin-digit');
            newPinInputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === 1 && index < newPinInputs.length - 1) {
                        newPinInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                        newPinInputs[index - 1].focus();
                    }
                });
            });

            // Verify PIN inputs
            const verifyPinInputs = document.querySelectorAll('.verify-pin-digit');
            verifyPinInputs.forEach((input, index) => {
                input.addEventListener('input', function() {
                    if (this.value.length === 1 && index < verifyPinInputs.length - 1) {
                        verifyPinInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                        verifyPinInputs[index - 1].focus();
                    }
                });
            });
        }

        // Check for existing user
        function checkExistingUser() {
            const savedUser = localStorage.getItem('userProfile');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                isLoggedIn = true;
                updateProfileDisplay();
                updateDropdownInfo();
            }
        }

        // Show appropriate form
        function showForm() {
            setTimeout(() => {
                if (isLoggedIn) {
                    showProfileDisplay();
                } else {
                    showRegistrationForm();
                }
            }, 100);
        }

        // Form submission handlers
        document.getElementById('user-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });

        document.getElementById('edit-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileUpdate();
        });

        document.getElementById('pin-form').addEventListener('submit', function(e) {
            e.preventDefault();
            handlePinUpdate();
        });

        // Registration handler
        function handleRegistration() {
            const formData = new FormData(document.getElementById('user-form'));
            const userData = {
                name: formData.get('name'),
                age: formData.get('age'),
                gender: formData.get('gender'),
                email: formData.get('email'),
                pin: getPinValue('.pin-digit')
            };

            if (userData.pin.length !== 4) {
                showMessage('Please enter a 4-digit PIN', 'error');
                return;
            }

            // Save user data
            localStorage.setItem('userProfile', JSON.stringify(userData));
            currentUser = userData;
            isLoggedIn = true;

            updateProfileDisplay();
            updateDropdownInfo();
            showProfileDisplay();
            showMessage('Profile created successfully!', 'success');
            
            // Reset form
            document.getElementById('user-form').reset();
            clearPinInputs('.pin-digit');
        }

        // Profile update handler
        function handleProfileUpdate() {
            const formData = new FormData(document.getElementById('edit-form'));
            const updatedData = {
                ...currentUser,
                name: formData.get('name'),
                email: formData.get('email')
            };

            localStorage.setItem('userProfile', JSON.stringify(updatedData));
            currentUser = updatedData;

            updateProfileDisplay();
            updateDropdownInfo();
            closeModal('edit-modal');
            showMessage('Profile updated successfully!', 'success');
        }

        // PIN update handler
        function handlePinUpdate() {
            const currentPin = getPinValue('.current-pin-digit');
            const newPin = getPinValue('.new-pin-digit');

            if (currentPin !== currentUser.pin) {
                showMessage('Current PIN is incorrect', 'error');
                return;
            }

            if (newPin.length !== 4) {
                showMessage('Please enter a 4-digit new PIN', 'error');
                return;
            }

            currentUser.pin = newPin;
            localStorage.setItem('userProfile', JSON.stringify(currentUser));

            closeModal('pin-modal');
            showMessage('PIN updated successfully!', 'success');
            clearPinInputs('.current-pin-digit');
            clearPinInputs('.new-pin-digit');
        }

        // Utility functions
        function getPinValue(selector) {
            const inputs = document.querySelectorAll(selector);
            return Array.from(inputs).map(input => input.value).join('');
        }

        function clearPinInputs(selector) {
            const inputs = document.querySelectorAll(selector);
            inputs.forEach(input => input.value = '');
        }

        function updateProfileDisplay() {
            if (!currentUser) return;
            
            document.getElementById('display-name').textContent = currentUser.name;
            document.getElementById('display-age').textContent = currentUser.age;
            document.getElementById('display-gender').textContent = currentUser.gender;
            document.getElementById('display-email').textContent = currentUser.email;
            
            // Update avatar
            const avatar = document.getElementById('profile-avatar');
            const dropdownAvatar = document.getElementById('dropdown-avatar');
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.innerHTML = initials;
            dropdownAvatar.innerHTML = initials;
        }

        function updateDropdownInfo() {
            if (!currentUser) return;
            
            document.getElementById('dropdown-name').textContent = currentUser.name;
            document.getElementById('dropdown-email').textContent = currentUser.email;
        }

        function showRegistrationForm() {
            document.getElementById('registration-form').classList.remove('hidden');
            document.getElementById('profile-display').classList.add('hidden');
        }

        function showProfileDisplay() {
            document.getElementById('registration-form').classList.add('hidden');
            document.getElementById('profile-display').classList.remove('hidden');
        }

        function openEditModal() {
            if (!currentUser) return;
            
            document.getElementById('edit-name').value = currentUser.name;
            document.getElementById('edit-email').value = currentUser.email;
            document.getElementById('edit-modal').classList.add('show');
        }

        function openPinModal() {
            document.getElementById('pin-modal').classList.add('show');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('show');
        }

        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }

        function logout() {
            localStorage.removeItem('userProfile');
            currentUser = null;
            isLoggedIn = false;
            showRegistrationForm();
            showMessage('Logged out successfully', 'success');
        }

        // Diary functionality
        function showPinVerification() {
            document.getElementById('profile-display').classList.add('hidden');
            document.getElementById('pin-verification').classList.remove('hidden');
            clearPinInputs('.verify-pin-digit');
            document.getElementById('pin-error').classList.add('hidden');
        }

        function verifyPin() {
            const enteredPin = getPinValue('.verify-pin-digit');
            
            if (enteredPin === currentUser.pin) {
                document.getElementById('pin-verification').classList.add('hidden');
                document.getElementById('diary-section').classList.remove('hidden');
                initializeDiary();
            } else {
                document.getElementById('pin-error').classList.remove('hidden');
                clearPinInputs('.verify-pin-digit');
            }
        }

        function lockDiary() {
            document.getElementById('diary-section').classList.add('hidden');
            document.getElementById('profile-display').classList.remove('hidden');
        }

        function initializeDiary() {
            initializeCalendar();
            initializeMoodSelector();
            initializeTaskManager();
            loadDiaryEntry(selectedDate);
        }

        function initializeCalendar() {
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            
            // Month navigation
            document.getElementById('prev-month').addEventListener('click', function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            });
            
            document.getElementById('next-month').addEventListener('click', function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            });
        }

        function renderCalendar(year, month) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const calendarDays = document.getElementById('calendar-days');
            
            calendarDays.innerHTML = '';
            
            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'h-10';
                calendarDays.appendChild(emptyDay);
            }
            
            // Add cells for each day of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'text-center py-2 cursor-pointer calendar-day relative';
                dayElement.textContent = day;
                
                const dateKey = formatDate(new Date(year, month, day));
                
                // Highlight today
                const today = new Date();
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                // Mark days with entries
                if (diaryEntries[dateKey]) {
                    dayElement.classList.add('has-entry');
                }
                
                // Highlight selected day
                if (year === selectedDate.getFullYear() && month === selectedDate.getMonth() && day === selectedDate.getDate()) {
                    dayElement.classList.add('selected');
                }
                
                dayElement.addEventListener('click', function() {
                    selectedDate = new Date(year, month, day);
                    renderCalendar(year, month);
                    loadDiaryEntry(selectedDate);
                });
                
                calendarDays.appendChild(dayElement);
            }
        }

        function formatDate(date) {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();
            
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            
            return [year, month, day].join('-');
        }

        function formatDateDisplay(date) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        function initializeMoodSelector() {
            const moodOptions = document.querySelectorAll('.mood-option');
            moodOptions.forEach(option => {
                option.addEventListener('click', function() {
                    moodOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedMood = this.getAttribute('data-mood');
                    document.getElementById('selected-mood').value = selectedMood;
                });
            });
        }

        function initializeTaskManager() {
            document.getElementById('add-task').addEventListener('click', function() {
                const tasksContainer = document.getElementById('tasks-container');
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task-item flex items-center';
                taskDiv.innerHTML = `
                    <input type="checkbox" class="mr-2">
                    <input type="text" class="flex-1 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-1 bg-transparent" placeholder="Add a task">
                    <button class="delete-task ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                tasksContainer.appendChild(taskDiv);
                
                // Focus the new task input
                taskDiv.querySelector('input[type="text"]').focus();
                
                // Add delete functionality
                taskDiv.querySelector('.delete-task').addEventListener('click', function() {
                    tasksContainer.removeChild(taskDiv);
                });
            });

            // Save entry functionality
            document.getElementById('save-entry').addEventListener('click', function() {
                saveDiaryEntry();
            });
        }

        function loadDiaryEntry(date) {
            const dateKey = formatDate(date);
            document.getElementById('diary-date').textContent = formatDateDisplay(date);
            
            // Reset form
            document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
            document.getElementById('selected-mood').value = '';
            document.getElementById('diary-entry').value = '';
            
            const tasksContainer = document.getElementById('tasks-container');
            tasksContainer.innerHTML = `
                <div class="task-item flex items-center">
                    <input type="checkbox" class="mr-2">
                    <input type="text" class="flex-1 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-1 bg-transparent" placeholder="Add a task">
                    <button class="delete-task ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add delete functionality to default task
            tasksContainer.querySelector('.delete-task').addEventListener('click', function() {
                tasksContainer.removeChild(tasksContainer.firstElementChild);
            });
            
            // Load saved entry if it exists
            if (diaryEntries[dateKey]) {
                const entry = diaryEntries[dateKey];
                
                // Set mood
                if (entry.mood) {
                    selectedMood = entry.mood;
                    document.querySelector(`.mood-option[data-mood="${entry.mood}"]`).classList.add('selected');
                    document.getElementById('selected-mood').value = entry.mood;
                }
                
                // Set tasks
                if (entry.tasks && entry.tasks.length > 0) {
                    tasksContainer.innerHTML = '';
                    entry.tasks.forEach(task => {
                        const taskDiv = document.createElement('div');
                        taskDiv.className = 'task-item flex items-center';
                        taskDiv.innerHTML = `
                            <input type="checkbox" class="mr-2" ${task.completed ? 'checked' : ''}>
                            <input type="text" class="flex-1 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-1 bg-transparent" value="${task.text}">
                            <button class="delete-task ml-2 text-red-500 hover:text-red-700">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        tasksContainer.appendChild(taskDiv);
                        
                        // Add delete functionality
                        taskDiv.querySelector('.delete-task').addEventListener('click', function() {
                            tasksContainer.removeChild(taskDiv);
                        });
                    });
                }
                
                // Set diary entry
                if (entry.text) {
                    document.getElementById('diary-entry').value = entry.text;
                }
            }
        }

        function saveDiaryEntry() {
            const dateKey = formatDate(selectedDate);
            const tasks = [];
            
            document.querySelectorAll('.task-item').forEach(taskItem => {
                const textInput = taskItem.querySelector('input[type="text"]');
                const checkbox = taskItem.querySelector('input[type="checkbox"]');
                
                if (textInput.value.trim()) {
                    tasks.push({
                        text: textInput.value.trim(),
                        completed: checkbox.checked
                    });
                }
            });
            
            diaryEntries[dateKey] = {
                date: dateKey,
                mood: document.getElementById('selected-mood').value,
                tasks: tasks,
                text: document.getElementById('diary-entry').value.trim()
            };
            
            localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
            
            // Update calendar to show entry marker
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
            
            // Show success feedback
            const saveBtn = document.getElementById('save-entry');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Saved!';
            saveBtn.classList.remove('btn-primary');
            saveBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                saveBtn.classList.add('btn-primary');
            }, 2000);
        }