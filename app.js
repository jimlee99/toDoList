document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const historyList = document.getElementById('historyList');

    // 从本地存储加载任务和历史记录
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let history = JSON.parse(localStorage.getItem('history') || '[]');

    function formatDateTime() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // 渲染任务列表
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';

            const taskDate = document.createElement('span');
            taskDate.className = 'task-date';
            taskDate.textContent = task.createdAt;

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const completeButton = document.createElement('button');
            completeButton.className = 'complete-task';
            completeButton.textContent = '完成';
            completeButton.addEventListener('click', () => completeTask(index));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-task';
            deleteButton.textContent = '删除';
            deleteButton.addEventListener('click', () => deleteTask(index));

            li.appendChild(taskDate);
            li.appendChild(taskText);
            li.appendChild(completeButton);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });

        // 保存到本地存储
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 渲染历史记录
    function renderHistory() {
        const historyContainer = historyList.querySelector('div') || document.createElement('div');
        historyContainer.innerHTML = '';
        
        history.forEach(record => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const createdDate = document.createElement('span');
            createdDate.className = 'history-date';
            createdDate.textContent = `创建: ${record.createdAt}`;

            const historyText = document.createElement('span');
            historyText.className = 'history-text';
            historyText.textContent = record.text;

            const historyStatus = document.createElement('span');
            historyStatus.className = `history-status status-${record.status}`;
            historyStatus.textContent = record.status === 'completed' ? '已完成' : '已删除';

            const actionDate = document.createElement('span');
            actionDate.className = 'history-date';
            actionDate.textContent = `${record.status === 'completed' ? '完成' : '删除'}: ${record.actionDate}`;

            historyItem.appendChild(createdDate);
            historyItem.appendChild(historyText);
            historyItem.appendChild(historyStatus);
            historyItem.appendChild(actionDate);

            historyContainer.appendChild(historyItem);
        });

        if (!historyList.contains(historyContainer)) {
            historyList.appendChild(historyContainer);
        }

        localStorage.setItem('history', JSON.stringify(history));
    }

    // 添加新任务
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            const createdAt = formatDateTime();
            tasks.push({
                text,
                createdAt
            });
            taskInput.value = '';
            renderTasks();
            // 保存到本地存储
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // 完成任务
    function completeTask(index) {
        const task = tasks[index];
        
        // 添加到历史记录
        history.push({
            text: task.text,
            status: 'completed',
            createdAt: task.createdAt,
            actionDate: formatDateTime()
        });

        tasks.splice(index, 1);
        renderTasks();
        renderHistory();
    }

    // 删除任务
    function deleteTask(index) {
        const task = tasks[index];
        
        // 添加到历史记录
        history.push({
            text: task.text,
            status: 'deleted',
            createdAt: task.createdAt,
            actionDate: formatDateTime()
        });

        tasks.splice(index, 1);
        renderTasks();
        renderHistory();
    }

    // 事件监听
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 初始渲染
    renderTasks();
    renderHistory();
});