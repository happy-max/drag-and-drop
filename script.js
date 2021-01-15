const backlogListEl = document.getElementById('backlog-list')
const progressListEl = document.getElementById('progress-list')
const completeListEl = document.getElementById('complete-list')
const onHoldListEl = document.getElementById('on-hold-list')
const listColumns = document.querySelectorAll('.drag-item-list')
const addBtns = document.querySelectorAll('.add-btn:not(.solid)')
const addItemContainers = document.querySelectorAll('.add-container')
const saveItemBtns = document.querySelectorAll('.solid')
const addItem = document.querySelectorAll('.add-item')

let updatedOnLoad = false
let dragging = false
let draggedItem
let currentColumn

backlogListArray = []
progressListArray = []
completeListArray = []
onHoldListArray = []
listArrays = []

function getSavedColumns() {
    if (localStorage.getItem('backlogItems')) {
        backlogListArray = JSON.parse(localStorage.backlogItems)
        progressListArray = JSON.parse(localStorage.progressItems)
        completeListArray = JSON.parse(localStorage.completeItems)
        onHoldListArray = JSON.parse(localStorage.onHoldItems)
    } else {
        backlogListArray = ['Drink Coffee', 'Sit back and relax']
        progressListArray = ['Work on projects', 'Listen to music']
        completeListArray = ['Being cool', 'Getting stuff done']
        onHoldListArray = ['Being uncool']
    }
}

function updateSavedColumn() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
    arrayNames.map((name, index) => {
        return localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]))
    })
}

function createItemsElement(columnEl, column, item, index) {
    const listEl = document.createElement('li')
    listEl.id = index
    listEl.textContent = item
    listEl.classList.add('drag-item')
    listEl.draggable = true
    listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
    listEl.setAttribute('ondragstart', 'drag(event)')
    listEl.contentEditable = true
    columnEl.appendChild(listEl)
}

function filterArray(array) {
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

function callCreateItemsElement(element, array, i) {
    element.textContent = ''
    array.map((item, index) => {
        return createItemsElement(element, i, item, index)
    })
}

function updateDOM() {
    if (!updatedOnLoad) { getSavedColumns() }
    callCreateItemsElement(backlogListEl, backlogListArray, 0)
    backlogListArray = filterArray(backlogListArray)
    callCreateItemsElement(progressListEl, progressListArray, 1)
    progressListArray = filterArray(progressListArray)
    callCreateItemsElement(completeListEl, completeListArray, 2)
    completeListArray = filterArray(completeListArray)
    callCreateItemsElement(onHoldListEl, onHoldListArray, 3)
    onHoldListArray = filterArray(onHoldListArray)
    updatedOnLoad = true
    updateSavedColumn()
}

function updateItem(id, column) {
    const selectedArray = listArrays[column]
    const selectedColumn = listColumns[column].children
    if (!dragging) {
        if (!selectedColumn[id].textContent) {
            delete selectedArray[id]
        } else {
            selectedArray[id] = selectedColumn[id].textContent
        }
        updateDOM()
    }
}

function addToColumn(column) {
    const itemText = addItem[column].textContent
    const itemArray = listArrays[column]
    if (itemText !== '') {
        itemArray.push(itemText)
        addItem[column].textContent = ''
        updateDOM()
    }
}

function showInputBox(column) {
    addBtns[column].style.visibility = 'hidden'
    addItemContainers[column].style.display = 'flex'
    saveItemBtns[column].style.display = 'flex'
}

function hideInputBox(column) {
    addBtns[column].style.visibility = 'visible'
    addItemContainers[column].style.display = 'none'
    saveItemBtns[column].style.display = 'none'
    addToColumn(column)
}

function dragEnter(column) {
    listColumns[column].classList.add('over')
    currentColumn = column
}

function drag(e) {
    draggedItem = e.target
    dragging = true
}

function allowDrop(e) {
    e.preventDefault()
}

function rebuildArrays() {
    backlogListArray = Array.from(backlogListEl.children).map(item => item.textContent)
    progressListArray = Array.from(progressListEl.children).map(item => item.textContent)
    completeListArray = Array.from(completeListEl.children).map(item => item.textContent)
    onHoldListArray = Array.from(onHoldListEl.children).map(item => item.textContent)
    updateDOM()
}

function drop(e) {
    e.preventDefault()
    const parent = listColumns[currentColumn]
    console.log(listColumns)
    listColumns.forEach(column => {
        column.classList.remove('over')
    })
    parent.appendChild(draggedItem)
    dragging = false
    rebuildArrays()
}

updateDOM()

