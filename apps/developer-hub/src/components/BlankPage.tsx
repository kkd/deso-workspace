import { identity } from '@deso-core/identity';
import axios from 'axios';
import { useContext } from 'react';
import { DesoIdentityContext } from '../services/DesoIdentityContext';

export function BlankPage() {
  const { currentUser } = useContext(DesoIdentityContext);

  return (
    <div>
      <h1>Desojs V2 demo</h1>
      <p>Current user: {currentUser?.publicKey ?? 'no user'}</p>
      <button onClick={() => identity.login()}>Login</button>
      <button onClick={() => identity.logout()} className="ml-4">
        Logout
      </button>
      <button onClick={() => identity.jwt()} className="ml-4">
        Generate jwt
      </button>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();

          const hasPermissions = identity.hasPermissions({
            TransactionCountLimitMap: {
              SUBMIT_POST: 1,
            },
          });

          if (!hasPermissions) {
            identity.requestPermissions({
              GlobalDESOLimit: 0.01 * 1e9,
              TransactionCountLimitMap: {
                SUBMIT_POST: 3,
              },
            });
            return;
          }

          const body = e.target[0].value;

          identity.signAndSubmitTx(() =>
            axios
              .post('https://node.deso.org/api/v0/submit-post', {
                UpdaterPublicKeyBase58Check: identity.activePublicKey,
                BodyObj: {
                  Body: body,
                  ImageURLs: [],
                  VideoURLs: [],
                },
                MinFeeRateNanosPerKB: 1000,
              })
              .then(({ data }) => data)
          );
        }}
      >
        <textarea
          name="post-textarea"
          cols={30}
          rows={10}
          style={{ border: '1px solid black' }}
        ></textarea>
        <button>Post</button>
      </form>
    </div>
  );
}