let tasks = [
  {
    id: '1138465078061',
    completed: false,
    text: 'Посмотреть новый урок по JavaScript',
  },
  {
    id: '1138465078062',
    completed: false,
    text: 'Выполнить тест после урока',
  },
  {
    id: '1138465078063',
    completed: false,
    text: 'Выполнить ДЗ после урока',
  },
]
const createTask = (taskId, taskText) => {
  const taskItem = document.createElement('div')
  taskItem.className = 'task-item'
  taskItem.dataset.taskId = taskId // Устанавливает атрибут data-task-id равным taskId (это будет использоваться для идентификации задачи).
  const taskItemContainer = document.createElement('div')
  taskItemContainer.className = 'task-item__main-container'
  const taskItemContent = document.createElement('div')
  taskItemContent.className = 'task-item__main-content'
  taskItem.append(taskItemContainer)
  taskItemContainer.append(taskItemContent)

  const checkboxForm = document.createElement('form')
  checkboxForm.className = 'checkbox-form'

  const inputCheckbox = document.createElement('input')
  inputCheckbox.className = 'checkbox-form__checkbox'
  inputCheckbox.type = 'checkbox'

  const inputId = `task-${taskId}`
  inputCheckbox.id = inputId

  const labelCheckbox = document.createElement('label')
  labelCheckbox.htmlFor = inputId

  checkboxForm.append(inputCheckbox, labelCheckbox)

  const taskItemText = document.createElement('span')
  taskItemText.className = 'task-item__text'
  taskItemText.innerText = taskText

  const deleteButton = document.createElement('button')
  deleteButton.className =
    'task-item__delete-button default-button delete-button'
  deleteButton.innerText = 'Удалить'

  taskItemContent.append(checkboxForm, taskItemText)
  taskItemContainer.append(deleteButton)

  return taskItem
}

const tasksListContainer = document.querySelector('.tasks-list')

const taskForm = document.querySelector('.create-task-block')
taskForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const { target } = event
  console.log(target)

  const text = event.target.taskName.value.trim()
  const $errorBlock = taskForm.querySelector('.error-message-block') // Цель: Этот код предназначен для поиска на странице уже существующего элемента, который отображает сообщение об ошибке. Используется для удаления старого сообщения об ошибке, если оно есть.
  if ($errorBlock) {
    $errorBlock.remove() //если при предыдущей отправке формы возникла ошибка, и сообщение об этой ошибке было показано пользователю, то перед обработкой новой отправки это сообщение об ошибке удаляется. Это делается для того, чтобы пользователь не видел старое сообщение об ошибке, если текущие данные верны.
  }
  if (!text) {
    taskForm.append(createError('Название задачи не должно быть пустым')) //если текст пустой мы добавляем ошибку
    return
  }
  const isEqualText = tasks.some(
    (task) => task.text.toLowerCase() === text.toLowerCase()
  )
  if (isEqualText) {
    taskForm.append(createError('Задача с таким названием уже существует')) //если такой текст уже есть, мы добавляем ошибку
    event.target.taskName.value = ''
    return
  }

  const task = {
    id: String(Date.now()),
    completed: false,
    text,
  }
  tasks.push(task)
  tasksListContainer.append(createTask(task.id, task.text))
  event.target.taskName.value = ''
  console.log(tasks)
})

tasks.forEach((task) => {
  const taskItem = createTask(task.id, task.text)
  tasksListContainer.append(taskItem)
})

function createError(textError) {
  const $spanErrorMessage = document.createElement('span') // Это создание нового HTML-элемента и задание ему класса.Используется для добавления нового сообщения об ошибке.
  $spanErrorMessage.className = 'error-message-block' // для стилизации ошибки
  $spanErrorMessage.innerText = textError
  return $spanErrorMessage
}

const $modalOverlay = document.createElement('div')
$modalOverlay.className = 'modal-overlay modal-overlay_hidden'
const $deleteModal = document.createElement('div')
$deleteModal.className = 'delete-modal'
$modalOverlay.append($deleteModal)

const $modalQuestion = document.createElement('h3')
$modalQuestion.className = 'delete-modal__question'
$modalQuestion.textContent = 'Вы действительно хотите удалить эту задачу?'

const $deleteButtons = document.createElement('div')
$deleteButtons.className = 'delete-modal__buttons'

const $buttonCancel = document.createElement('button')
$buttonCancel.className = 'delete-modal__button delete-modal__cancel-button'
$buttonCancel.textContent = 'Отмена'

const $buttonConfirm = document.createElement('button')
$buttonConfirm.className = 'delete-modal__button delete-modal__confirm-button'
$buttonConfirm.textContent = 'Удалить'

$deleteButtons.append($buttonCancel, $buttonConfirm)

$deleteModal.append($modalQuestion, $deleteButtons)
console.log($modalOverlay)

const bodyTeg = document.querySelector('body')
bodyTeg.append($modalOverlay)
console.log(bodyTeg)

///////////////
let taskItemToDelete
document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.task-item__delete-button') // выполняет поиск родительских элементов (и самого элемента) в DOM-дереве вверх, начиная от элемента, на котором вызван этот метод.
  if (!deleteButton) {
    return // Если клик был не по кнопке удаления, то просто выходим.
  }
  taskItemToDelete = deleteButton.closest('.task-item') // ищет ближайший родительский элемент, у которого есть CSS-класс .task-item.
  if (!taskItemToDelete) {
    return
  }

  const taskId = taskItemToDelete?.dataset.taskId
  console.log(taskId)

  $modalOverlay.classList.remove('modal-overlay_hidden')

  $buttonCancel.addEventListener('click', (event) => {
    $modalOverlay.classList.add('modal-overlay_hidden')
  })
  $buttonConfirm.addEventListener('click', (event) => {
    $modalOverlay.classList.add('modal-overlay_hidden')

    tasks = tasks.filter((task) => task.id !== taskId)
    console.log(tasks)
    renderTasks() // после того, как мы отфильтровали массив tasks (удаляя задачу из массива) мы вызываем renderTasks();, чтобы обновить список задач на странице, удалив визуально элемент, который был удален из массива.
  })
})

function renderTasks() {
  tasksListContainer.innerHTML = '' // очищает содержимое tasksListContainer, то есть удаляет все элементы.
  tasks.forEach((task) => {
    const taskItem = createTask(task.id, task.text) // отрисовывает заново все задачи.
    tasksListContainer.append(taskItem)
  })
}
renderTasks() // // Изначальная отрисовка задач

let isDarkTheme = false

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    isDarkTheme = !isDarkTheme
    applyTheme()
    event.preventDefault()
  }
})
function applyTheme() {
  const body = document.body
  const taskItems = document.querySelectorAll('.task-item')
  const buttons = document.querySelectorAll('button')

  if (isDarkTheme) {
    body.style.background = '#24292E'
    taskItems.forEach((item) => (item.style.color = '#ffffff'))
    buttons.forEach((button) => (button.style.border = '1px solid #ffffff'))
  } else {
    body.style.background = 'initial'
    taskItems.forEach((item) => (item.style.color = 'initial'))
    buttons.forEach((button) => (button.style.border = 'none'))
  }
}

// Первоначальное применение темы
applyTheme()
