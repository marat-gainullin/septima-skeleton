Select
    u.userDisplayName userName,
    u.userEmail email,
    u.userAvatar avatar
From appUsers u
Where u.userEmail = :email