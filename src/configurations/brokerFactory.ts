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
import {BrokerInstance} from 'dssim-kubernetes-controller';
import fs from 'fs';

const loadBrokerCrtFile = () =>
  fs.readFileSync(`./assets/broker/server.crt`, 'base64');

const loadBrokerKeyFile = () =>
  fs.readFileSync(`./assets/broker/server.key`, 'base64');

const loadBrokerJksFile = () =>
  fs.readFileSync(`./assets/broker/isstbroker-keystore.jks`, 'base64');

export const brokerFactory = () =>
  new BrokerInstance(
    'broker',
    'user',
    'admin',
    loadBrokerCrtFile(),
    loadBrokerKeyFile(),
    loadBrokerJksFile()
  );
