set -e
# Script used in github actions workflows to determine the type of
# npm version bump we want to do. We infer it from the commit message.
# fix -> patch
# feat -> minor
# BREAKING_CHANGE -> major (actually made it minor until it hit's 1.0 release)

npm ci

# The script expects 1 argument which is the directory lib we want to bump,
# relative to the root directory (libs/deso-protocol, etc)
cd libs/$1

# get that last commit message
LAST_COMMIT_MSG=`git log -1 --pretty=format:"%s%n%b"`

# extract the commit type from the commit message summary (fix, feat, etc)
# - the message summary is realiably on the 5th line of the message output
# - get summary up to the first colon, shoudl be the conventional commit "type"
# - xargs just strips surrounding whitespace
TYPE=`echo $LAST_COMMIT_MSG  | cut -d: -f1 | xargs`

# First check if the BREAKING_CHANGE keyword is preset.
# If so, we force a major version bump.
if [[ -n `echo $LAST_COMMIT_MSG | grep "BREAKING_CHANGE"` ]]; then
    # Until we're ready to bump to 1.0 we just bump minor for this.
    # npm version major
    npm version minor
    # for commits with the 'feat' type that are not breaking changes we do a minor version increment.
    elif [[ $TYPE == 'feat' ]]; then
    npm version minor
    # for commits with the 'fix' type that are not breaking changes we do a patch version increment.
    elif [[ $TYPE == 'fix' ]]; then
    npm version patch
    # if none of feat, fix, or BREAKING_CHANGE are detected we don't publish anything.
else
    echo "No new version published. Could not infer new version from commit message. Required types are (fix, feat):"
    echo $"$LAST_COMMIT_MSG"
    echo "If your change is a breaking change, please add BREAKING_CHANGE to your commit message."
    exit 1
fi

cd -

npx nx run $1:build
cd dist/libs/$1

echo "Publishing new version"
npm version
npm publish --access public
cd -

git add libs/$1/package.json
git commit -m "ci: automated release version bump"
git push origin HEAD:master
