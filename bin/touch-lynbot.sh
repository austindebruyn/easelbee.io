set -ex
echo "$LYNBOT_PASSWORD"
curl https://$LYNBOT_HOST/deploy \
  -H "Authorization: $LYNBOT_PASSWORD" \
  -H "Content-Type: application/json" \
  -d "{\"commit\":\"$TRAVIS_COMMIT\",\"buildNumber\":\"$TRAVIS_BUILD_NUMBER\"}"
