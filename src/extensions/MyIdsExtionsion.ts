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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {DSCController} from 'dssim-ids-controller';
import {Artifact, Endpoint, Offer} from 'dssim-core';

export class MyCustomIDSControllerExtension extends DSCController {
  constructor(
    hostname: string,
    username: string,
    password: string,
    endpoints: Endpoint[]
  ) {
    super(hostname, username, password, endpoints);
  }

  //override existing methods
  async createHttpEndpointArtifact(
    artifact: Artifact,
    endpointUrl: string,
    mimeType: string,
    apiKey?: {
      headerKey: string;
      value: string;
    },
    basicAuth?: {
      username: string;
      password: string;
    },
    ressourcePolling?: {
      delay: number;
      period: number;
    }
  ): Promise<string> {
    const superResult = await super.createHttpEndpointArtifact(
      artifact,
      endpointUrl,
      mimeType,
      apiKey,
      basicAuth,
      ressourcePolling
    );
    // Do sth!
    return superResult;
  }

  //using custom methods requires casting in szenario
  myCustomMethod(): void {}
}
