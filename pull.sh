git stash
git pull
git checkout stash@{0} -- user.json
git stash drop stash@{0}