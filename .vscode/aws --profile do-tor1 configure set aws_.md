aws --profile do-tor1 configure set aws_access_key_id DO00AHWN6Z6K7WGFNZBZ
aws --profile do-tor1 configure set aws_secret_access_key o5F11lk5h0pOaTR0ccl0ZFOLxVb46CdREEqILpaIQ2E
aws --profile do-tor1 configure set endpoint_url https://fra1.digitaloceanspaces.com

aws --profile do-tor1 s3 ls s3://data-h03

To confirm everything works, run the command below
aws --profile do-tor1 s3 ls s3://data-h03