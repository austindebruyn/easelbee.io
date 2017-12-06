set -ex

curl -vvv -X POST https://$LYNBOT_HOST/deploy \
  -H 'Authorization: $LYNBOT_PASSWORD' \
  -H 'Content-Type: application/json' \
  -d '{"commit":"$TRAVIS_COMMIT","buildNUmber":"TRAVIS_BUILD_NUMBER"}'
