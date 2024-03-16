type User = {
  id: number
}

type Variables = {
  user: User
}

type Environment = {
  Bindings: {
    ENV: string
  }
  Variables: Variables
}
