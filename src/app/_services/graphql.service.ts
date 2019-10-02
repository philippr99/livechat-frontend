import { Injectable } from "@angular/core";
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { split, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-angular-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { AuthenticationService } from './../_services/authentication.service';
import { async } from '@angular/core/testing';


@Injectable({
    providedIn: 'root'
})
export class GraphqlService {

    constructor(private Apollo: Apollo, private httpLink: HttpLink,  private authenticationService: AuthenticationService) {

        console.log(`ws://test@localhost:8081/graphql`);

        let http = httpLink.create({uri: 'http://localhost:8081/graphql' });
        let wsLink = new WebSocketLink({
            uri:`ws://localhost:8081/graphql`,
        });

        interface Definintion {
            kind: string;
            operation?: string;
          };
          
          const link = split(
            ({ query }) => {
              const { kind, operation }: Definintion = getMainDefinition(query);
              return kind === 'OperationDefinition' && operation === 'subscription';
            },
            wsLink,
            http,
          );
      
        Apollo.create({
            link: link,
            cache: new InMemoryCache()
        });
    }

    public getUserInformation() {
        return this.Apollo.query({
            query: gql`
            query{
                account{
                  id,
                  username
                }
            }`
        });
    }

    public getPastMessages() {
        return this.Apollo.query({
            query: gql`
            query {
                messages{
                  id,
                  author,
                  content,
                  timestamp,
                }
              }
            `
        });
    }

    public sendMessage(messageArg: string) {
        return this.Apollo.mutate({
            mutation: gql(`
            mutation sendMessage($message: String!) {
                sendMessage(content: $message){
                  id,
                  author,
                  content,
                  timestamp
                }
              }`),
        variables: {
            message: messageArg,
        }});
    }


    public subscribeMessages() {
        return this.Apollo.subscribe({
            query: gql`
                subscription {
                    messageReceived{
                        id,
                        author,
                        content,
                        timestamp,
                    }
                }
            `});
    }
}