import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from '../src/TaskItem.vue' // adjust this path!

describe('TaskItem', () => {
  it('renders the task text', async () => {
    const task = {
      id: 2,
      text: 'Buy oat milk',
      done: false,
      isEditing: false,
    }

    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    })

    // Assertion: it should contain the task text
    expect(wrapper.text()).toContain('Buy oat milk')
  })

  it('checks the checkbox', async () => {
    const task = {
      id: 2,
      text: 'Buy oat milk',
      done: true,
      isEditing: false,
    }

    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    })

    // Test emit 'done'
    const checkbox = wrapper.get('input[type="checkbox"')
    expect(checkbox.element.checked).toBe(true)
  })

  it('tests the emit done', async () => {
    const task = {
      id: 2,
      text: 'Buy oat milk',
      done: false,
      isEditing: false,
    }

    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    })

    // Test emit 'done'
    const checkbox = wrapper.get('input[type="checkbox"')
    await checkbox.setValue()

    const emitted = wrapper.emitted('done')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([2, true])
  })

  it('tests the remove function', async () => {
    const task = {
      id: 3,
      text: 'Test removing',
      done: false,
      isEditing: false,
    }

    const wrapper = mount(TaskItem, {
      props: {
        task,
      },
    })

    // Find remove button
    const removeButton = wrapper.get('button')
    await removeButton.trigger('click')

    // Listen to emit event 'remove-task'
    const emitted = wrapper.emitted('remove-task')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([3])
  })
})
