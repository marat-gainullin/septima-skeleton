Update AppUsers
Set
    userEmail = :email,
    userDisplayName = :userName,
    userAvatar = :avatar
Where
    userEmail = :oldEmail