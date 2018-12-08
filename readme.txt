// we have a branch that we are ready to push to the repo
// in a branch called name-of-branch
git add .
git commmit -m "these where my changes"

git checkout master
git pull

git checkout name-of-branch
git rebase master

git push origin name-of-branch

// go to github
// creat a pull request
// teammate approves
// clicks merge
// merges your terrible stuff into master