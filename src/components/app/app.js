import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component  {

  maxId = 100;

  createTodoItem = (label) =>  {
      return {
        label,
        important: false,
        done: false,
        id: this.maxId++
      }
    } 

  state = {
    todoData: [
      this.createTodoItem('Drink Energetos'),
      this.createTodoItem('Go to Kolodec'),
      this.createTodoItem('Eat Grechka'),
    ],
    term: '',
    filter: 'all' //active, all, done
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id)

    const oldItem = arr[idx]
    const newItem = { ...oldItem, [propName]: !oldItem[propName]}

    return [
      ...arr.slice(0,idx),
      newItem,
      ...arr.slice(idx+1)
    ]
  } 
  
  onToggleImportant = (id) => {
    this.setState( ({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
    console.log(`Toggle Important ${id}`)
  }

  onToggleDone = (id) => {
    this.setState( ({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
    console.log(`Toggle Done ${id}`)
  }

  deleteItem = (id) => {
    this.setState( ({todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id)

      const newArray = [
        ...todoData.slice(0,idx),
        ...todoData.slice(idx+1)
      ]
      return {
        todoData: newArray,
      }
    })
  }

  addItem = (text) => {
    //generate id ?
    const newItem = this.createTodoItem(text)

    //add element in array 
    this.setState( ({todoData}) => {
      const newArray = [...todoData, newItem]
      return {
        todoData: newArray
      }
    })
  }

  search(items, term) {
    if (term.length === 0) {
      return items
    }

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    })
  }

  onSearchChange = (term) => {
    this.setState({term})
  }

  onFilterChange = (filter) => {
    this.setState({filter})
  }

  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done)
      case 'done':
        return items.filter((item) => item.done)
      default:
        return items
    }
  }

  render () {

    

    const { todoData, term, filter } = this.state

    const visibleItems = this.filter(this.search(todoData, term), filter)

    const doneCount = todoData.filter((el) => el.done).length
    const todoCount = todoData.length - doneCount

    return(
      <div className="todo-app .grechka">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel
            onSearchChange={this.onSearchChange}
          />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange} />
        </div>
        
        <TodoList 
          todos={visibleItems}
          onDeleted={ this.deleteItem }
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
         /> 
         <ItemAddForm onItemAdded={this.addItem}/>
      </div>
    )
  }
}
