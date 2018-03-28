Select
     upr.userEmail userEmail,
     upr.userNonce userNonce,
     upr.nonceExpiration nonceExpiration
From AppUsersPasswordRecovering upr
Where upr.userEmail = :email and upr.nonceExpiration > :moment