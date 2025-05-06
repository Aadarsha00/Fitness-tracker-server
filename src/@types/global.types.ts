export enum Role {
  user = "USER",
  admin = "ADMIN",
}

export enum BodyPart {
  chest = "Chest",
  back = "Back",
  legs = "Legs",
  shoulders = "Shoulders",
  arms = "Arms",
  core = "Core",
  cardio = "Cardio",
  fullBody = "Full body",
  other = "Other",
}

export const onlyAdmin = [Role.admin];
export const onlyUser = [Role.user];
export const allUser = [Role.user, Role.admin];
