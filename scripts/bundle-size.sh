MAX_BUNDLE_SIZE_KB=500

commands=""

output="##Bundle Size\n"
output+="| Javascript Bundle | Size (gzip compressed) | Check | \n"
output+="| ----------------- | ---------------------- | ----- | \n"

for bundle in build/static/js/*.js; do
  # We do not care about absolute size, but compressed size (= network transfer size)
  compressed_size=$(gzip -c $bundle | wc -c)

  in_bounds="yes"
  if (( compressed_size > MAX_BUNDLE_SIZE_KB * 1000 )); then
    in_bounds="no"
    commands+="::error file=./scripts/bundle-size.sh,line=1,col=1,title=Bundle Size Exceeded::$bundle has a size of $compressed_size bytes (gzip compressed)\n"
  fi


  output+="| $bundle | $compressed_size | $in_bounds |\n"
done

echo $output

echo $output >> $GITHUB_STEP_SUMMARY
echo $commands >> $GITHUB_STEP_SUMMARY
