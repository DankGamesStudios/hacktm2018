# hacktm2018

### To start client
```
cd client
```

```
npm install
```

```
npm run-script server:dev
```

### To run server tests

It would be best to run these in a virtualenv.

```
virtualenv --python=$(which python3) spamvenv
source spamvenv/bin/activate
```

Then install the spam-server and run the spam server
```
cd server
pip install . -e # might not be needed
python -m api.ws
# or run tests
python -m pytest server/test/test_*.py
```
