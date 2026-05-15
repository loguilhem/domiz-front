const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Une erreur est survenue.'
    try {
      const body = await response.json()
      if (Array.isArray(body.detail)) {
        message = body.detail.map((detail) => detail.msg).join(' ')
      } else {
        message = body.detail ?? message
      }
    } catch {
      message = response.statusText || message
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function toFamily(family) {
  return {
    id: family.id,
    name: family.name,
    members: family.members.map(toMember),
  }
}

function toMember(member) {
  return {
    id: member.id,
    userId: member.user_id,
    firstName: member.firstname,
    lastName: member.name,
    email: member.email,
    birthDate: member.birthdate,
    role: member.relationship_type,
    status: member.status,
  }
}

function toProfile(user) {
  return {
    id: user.id,
    firstName: user.firstname,
    lastName: user.name,
    email: user.email,
    birthDate: user.birthdate,
    passwordStatus: 'Défini',
  }
}

function toAuth(auth) {
  return {
    token: auth.token,
    user: toProfile(auth.user),
  }
}

function toCategory(category) {
  return {
    id: category.id,
    familyId: category.family_id,
    name: category.name,
    icon: category.icon ?? 'tag',
    iconColor: category.icon_color ?? '#2ad7ff',
  }
}

function toTask(task) {
  return {
    id: task.id,
    familyId: task.family_id,
    name: task.name,
    description: task.description ?? '',
    dueDate: task.due_date ?? '',
    points: task.points,
    recurrenceType: task.recurrence_type ?? '',
    state: task.state,
    categories: task.categories.map(toCategory),
  }
}

function memberPayload(member, status = member.status ?? 'Membre local') {
  return {
    firstname: member.firstName,
    name: member.lastName,
    email: member.email || null,
    birthdate: member.birthDate,
    relationship_type: member.role,
    status,
  }
}

export async function fetchFamilies() {
  const families = await request('/families/')
  return families.map(toFamily)
}

export async function createFamily(family) {
  const createdFamily = await request('/families/', {
    method: 'POST',
    body: JSON.stringify({ name: family.name }),
  })
  return toFamily(createdFamily)
}

export async function createFamilyMember(familyId, member) {
  const createdMember = await request(`/families/${familyId}/members`, {
    method: 'POST',
    body: JSON.stringify(memberPayload(member)),
  })
  return toMember(createdMember)
}

export async function fetchFamilyCategories(familyId) {
  const categories = await request(`/families/${familyId}/categories`)
  return categories.map(toCategory)
}

export async function createFamilyCategory(familyId, category) {
  const createdCategory = await request(`/families/${familyId}/categories`, {
    method: 'POST',
    body: JSON.stringify({
      name: category.name,
      icon: category.icon,
      icon_color: category.iconColor,
    }),
  })
  return toCategory(createdCategory)
}

export async function updateCategory(category) {
  const updatedCategory = await request(`/categories/${category.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: category.name,
      icon: category.icon,
      icon_color: category.iconColor,
    }),
  })
  return toCategory(updatedCategory)
}

export async function deleteCategory(categoryId) {
  await request(`/categories/${categoryId}`, {
    method: 'DELETE',
  })
}

function taskPayload(task) {
  return {
    name: task.name,
    description: task.description || null,
    due_date: task.dueDate || null,
    points: Number(task.points) || 0,
    recurrence_type: task.recurrenceType || null,
    category_ids: task.categoryIds,
    state: task.state ?? 'todo',
  }
}

export async function fetchFamilyTasks(familyId) {
  const tasks = await request(`/families/${familyId}/tasks`)
  return tasks.map(toTask)
}

export async function createFamilyTask(familyId, task) {
  const createdTask = await request(`/families/${familyId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(taskPayload(task)),
  })
  return toTask(createdTask)
}

export async function updateTask(task) {
  const updatedTask = await request(`/tasks/${task.id}`, {
    method: 'PATCH',
    body: JSON.stringify(taskPayload(task)),
  })
  return toTask(updatedTask)
}

export async function deleteTask(taskId) {
  await request(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function inviteFamilyMember(familyId, invitation) {
  const createdMember = await request(`/families/${familyId}/members`, {
    method: 'POST',
    body: JSON.stringify(memberPayload(invitation, 'Invitation envoyée')),
  })
  return toMember(createdMember)
}

export async function updateFamilyMember(familyId, member) {
  const updatedMember = await request(`/families/${familyId}/members/${member.id}`, {
    method: 'PATCH',
    body: JSON.stringify(memberPayload(member)),
  })
  return toMember(updatedMember)
}

export async function loginAccount(credentials) {
  const auth = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return toAuth(auth)
}

export async function registerAccount(account) {
  const auth = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: account.email,
      password: account.password,
      password_confirmation: account.passwordConfirmation,
      birthdate: account.birthDate,
    }),
  })
  return toAuth(auth)
}

export async function fetchProfile(userId) {
  if (!userId) {
    return null
  }

  const user = await request(`/users/${userId}`)
  return toProfile(user)
}

export async function updateProfile(profile) {
  const updatedUser = await request(`/users/${profile.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      firstname: profile.firstName,
      name: profile.lastName,
      email: profile.email,
      birthdate: profile.birthDate,
      password: profile.password || null,
    }),
  })
  return {
    ...toProfile(updatedUser),
    passwordStatus: profile.password ? 'Mis à jour' : 'Défini',
  }
}
