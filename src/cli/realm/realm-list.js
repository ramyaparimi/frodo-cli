import { Command, Option } from 'commander';
import { Authenticate, Realm, state } from '@rockcarver/frodo-lib';
import * as common from '../cmd_common.js';

const { listRealms } = Realm;
const { getTokens } = Authenticate;

const program = new Command('frodo realm list');

program
  .description('List realms.')
  .helpOption('-h, --help', 'Help')
  .showHelpAfterError()
  .addArgument(common.hostArgumentM)
  .addArgument(common.realmArgument)
  .addArgument(common.userArgument)
  .addArgument(common.passwordArgument)
  .addOption(common.deploymentOption)
  .addOption(common.insecureOption)
  .addOption(
    new Option('-l, --long', 'Long with all fields.').default(false, 'false')
  )
  .action(
    // implement command logic inside action handler
    async (host, realm, user, password, options) => {
      state.default.session.setTenant(host);
      state.default.session.setRealm(realm);
      state.default.session.setUsername(user);
      state.default.session.setPassword(password);
      state.default.session.setDeploymentType(options.type);
      state.default.session.setAllowInsecureConnection(options.insecure);
      if (await getTokens()) {
        console.log('Listing all realms...');
        await listRealms(options.long);
      }
    }
    // end command logic inside action handler
  );

program.parse();
