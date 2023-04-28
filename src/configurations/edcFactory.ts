/*
 * Copyright 2023 Fraunhofer IEE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *       Michel Otto - initial implementation
 *
 */
import {Endpoint} from 'dssim-core';
import {EDCInstance} from 'dssim-kubernetes-controller';
import fs from 'fs';
import {pullSecret} from './index.js';

const loadEdcKeyStoreFile = () =>
  fs.readFileSync(`./assets/edc/certs/cert.pfx`, 'base64');

const loadEdcVaultFile = () =>
  fs.readFileSync(`./assets/edc/consumer-vault.properties`).toString();

const generateEdcConfig = (hostname: string, endpoints: Endpoint[]) => {
  return `---
  edc.ids.id=urn:connector:${hostname}
  ids.webhook.address=http://${hostname}:${
    endpoints.find(e => e.name === 'ids')?.port
  }
  web.http.port=${endpoints.find(e => e.name === 'controller')?.port}
  web.http.path=${endpoints.find(e => e.name === 'controller')?.path}
  web.http.management.port=${
    endpoints.find(e => e.name === 'datamanagement')?.port
  }
  web.http.management.path=${
    endpoints.find(e => e.name === 'datamanagement')?.path
  }
  web.http.ids.port=${endpoints.find(e => e.name === 'ids')?.port}
  web.http.ids.path=${endpoints.find(e => e.name === 'ids')?.path}
  web.http.protocol.port=${endpoints.find(e => e.name === 'dataplane')?.port}
  web.http.protocol.path=${endpoints.find(e => e.name === 'dataplane')?.path}
  edc.receiver.http.endpoint=http://dataservice:4000/receiver/urn:connector:provider/callback
  edc.public.key.alias=public-key
  edc.transfer.dataplane.token.signer.privatekey.alias=1
  edc.transfer.proxy.token.signer.privatekey.alias=1
  edc.transfer.proxy.token.verifier.publickey.alias=public-key
  web.http.public.port=${endpoints.find(e => e.name === 'public')?.port}
  web.http.public.path=${endpoints.find(e => e.name === 'public')?.path}
  web.http.control.port=${endpoints.find(e => e.name === 'control')?.port}
  web.http.control.path=${endpoints.find(e => e.name === 'control')?.path}
  edc.dataplane.token.validation.endpoint=http://${hostname}:${
    endpoints.find(e => e.name === 'control')?.port
  }/control/token`;
};

export const edcFactory = (deploymentName: string) =>
  new EDCInstance(
    deploymentName,
    'username',
    'password',
    generateEdcConfig,
    loadEdcKeyStoreFile(),
    loadEdcVaultFile(),
    '123456',
    [
      {
        image:
          'registry.gitlab.cc-asp.fraunhofer.de/dssim/dssim-kubernetes-controller/edchttpt',
        pullSecret: pullSecret,
      },
    ]
  );
