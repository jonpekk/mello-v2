export async function checkAuthOnClient() {
  try {
    const response = await fetch('/api/v1/auth/check')
    if (!response.ok) {
      throw new Error('Failed to check auth')
    }
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(error)
    // TODO: This should be something different in the case where a user is logged in but this function fails
    return { isLoggedIn: false, id: undefined }
  }
}