select
    u.userEmail email,
    u.userDisplayName userName,
    u.userAvatar avatar,
    u.userDigest digest,
    r.userEmail roleUserEmail,
    r.userGroup role
from appUsers u inner join appUsersGroups r