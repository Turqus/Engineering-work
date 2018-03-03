// example use
// add ApiService in module dependencies
// call one of the ApiService functions
// ApiService.item.all().then(function (result) { console.log('items', result); })


angular.module('TodoListApp')
    .service('ApiService', ['$q', '$http', function ($q, $http) {

        var routes = {
            user: '/users',
            profile: '/profile',
            board: '/board',
            card: '/card',
            permissions: '/permissions'
        };
        
        var api = {
            permissions: {
                permissionToComment: function (data) {
                    return post({
                        url: routes.permissions + '/to-comment',
                        data: data
                    });
                },
                permissionsToAddLists: function (data) {
                    return post({
                        url: routes.permissions + '/to-add-lists',
                        data: data
                    });
                },
                permissionsToAddCards: function (data) {
                    return post({
                        url: routes.permissions + '/to-add-cards',
                        data: data
                    });
                },
                permissionsToAddingPeopleToTheBoard: function (data) {
                    return post({
                        url: routes.permissions + '/to-adding-people-to-the-board',
                        data: data
                    });
                },
                permissionsToAddingPeopleToTheCards: function (data) {
                    return post({
                        url: routes.permissions + '/to-adding-people-to-the-cards',
                        data: data
                    });
                },
                permissionsToTheVisibilityOfTheBoard: function (data) {
                    return post({
                        url: routes.permissions + '/to-the-visibility-of-the-board',
                        data: data
                    });
                } 
            },
            card: {
                deadline: function (data) {
                    return post({
                        url: routes.card + '/set-deadline',
                        data: data
                    });
                },
                deleteCard: function (data) {
                    return post({
                        url: routes.card + '/delete-card',
                        data: data
                    });
                },
                archiveCard: function (data) {
                    return post({
                        url: routes.card + '/archive-card',
                        data: data
                    });
                },
                sendBackToBoardCard: function (data) {
                    return post({
                        url: routes.card + '/send-back-card',
                        data: data
                    });
                },
                sendListBackToBoard: function (data) {
                    return post({
                        url: routes.card + '/send-back-list',
                        data: data
                    });
                }, 
                deleteListOfTasks: function (data) {
                    return post({
                        url: routes.card + '/delete-list-tasks',
                        data: data
                    });
                },
                deleteTaskFromList: function (data) {
                    return post({
                        url: routes.card + '/delete-task',
                        data: data
                    });
                },
                transferCard: function (data) {
                    return put({
                        url: routes.card + '/transfer-card',
                        data: data
                    });
                },
                copyCard: function (data) {
                    return put({
                        url: routes.card + '/copy-card',
                        data: data
                    });
                },
                deleteImageFromCard: function (data) {
                    return post({
                        url: routes.card + '/delete-image-from-card',
                        data: data
                    });
                },
                addLabelToCard: function (data) {
                    return post({
                        url: routes.card + '/add/label/card',
                        data: data
                    });
                },
                add: function (data) {
                    return post({
                        url: routes.card + '/create/card',
                        data: data
                    });
                },
                addDescrip: function (data) {
                    return post({
                        url: routes.card + '/add/descrip/card',
                        data: data
                    });
                },
                addListsOfTasks: function (data) {
                    return post({
                        url: routes.card + '/add/lists/tasks',
                        data: data
                    });
                },
                update: function (data) {
                    return put({
                        url: routes.card + '/updatecards',
                        data: data
                    });
                }, 
            },
            user: { 
                 usercards: function (params) {
                    return get({
                        url: routes.user + '/usercards',
                        params: params
                    });
                },
                cards: function (params) {
                    return get({
                        url: routes.user + '/cards',
                        params: params
                    });
                },
                changeStatus: function (data) {
                    return post({
                        url: routes.user + '/change-status',
                        data: data
                    });
                },
            },
            profile: {
                updateInformation: function (data) {
                    return post({
                        url: routes.profile + '/update/information',
                        data: data
                    });
                },
                updatePersonalInformation: function (data) {
                    return post({
                        url: routes.profile + '/update/personal/information',
                        data: data
                    });
                },
                changePassword: function (data) {
                    return post({
                        url: routes.profile + '/change-password',
                        data: data
                    });
                },
            },
            board: {
                changeBackground: function (data) {
                    return put({
                        url: routes.board + '/change/background',
                        data: data
                    });
                },
                toggleBoard: function (data) {
                    return post({
                        url: routes.board + '/toggle-board',
                        data: data
                    });
                },
                copyBoard: function (data) {
                    return post({
                        url: routes.board + '/copy-board',
                        data: data
                    });
                },
                copyList: function (data) {
                    return post({
                        url: routes.board + '/copy-list',
                        data: data
                    });
                },
                transferList: function (data) {
                    return post({
                        url: routes.board + '/transfer-list',
                        data: data
                    });
                },
                archiveList: function (data) {
                    return post({
                        url: routes.board + '/archive-list',
                        data: data
                    });
                },
                changeBackgroundToPhoto: function (data) {
                    return put({
                        url: routes.board + '/changePhoto',
                        data: data
                    });
                },
                findMember: function (data) { 
                    return post({
                        url: routes.board + '/find-member',
                        data: data
                    });
                },
                loadMembers: function (params) {
                    return get({
                        url: routes.board + '/load-members',
                        params: params
                    });
                },
                loadMembersToAddCard: function (data) {
                    return post({
                        url: routes.board + '/load-members-to-add-card',
                        data: data
                    });
                },
                deleteMemberWithBoard: function (data) { 
                    return post({
                        url: routes.board + '/delete-member-with-board',
                        data: data
                    });
                }, 
                addMemberToCard: function (data) { 
                    return post({
                        url: routes.board + '/add-member-to-card',
                        data: data
                    });
                }, 
                loadMembersCard: function (data) {
                    return post({
                        url: routes.board + '/load-members-card',
                        data: data
                    });
                },
                deleteMemberWithCard: function (data) { 
                    return post({
                        url: routes.board + '/delete-member-with-card',
                        data: data
                    });
                }, 
                deleteLabel: function (data) {
                    return post({
                        url: routes.board + '/label/delete',
                        data: data
                    });
                },
                addComment: function (data) {
                    return post({
                        url: routes.board + '/add/comment',
                        data: data
                    });
                },
                editComment: function (data) {
                    return post({
                        url: routes.board + '/edit-comment',
                        data: data
                    });
                },
                deleteComment: function (data) {
                    return post({
                        url: routes.board + '/delete-comment',
                        data: data
                    });
                },
                addList: function (data) {
                    return post({
                        url: routes.board + '/create/lists',
                        data: data
                    });
                },
                addBoard: function (data) {
                    return post({
                        url: routes.board + '/create/board',
                        data: data
                    });
                }, 
                addLabelToBoard: function (data) {
                    return post({
                        url: routes.board + '/add/label/board',
                        data: data
                    });
                },
                addMemberBoard: function (data) {
                    return post({
                        url: routes.board + '/add/member/board',
                        data: data
                    });
                }, 
                selectedBoard: function (params) {
                    return get({
                        url: routes.board + '/selected/board',
                        params: params
                    });
                },
                boards: function (params) {
                    return get({
                        url:  '/boards-list',
                        params: params
                    });
                },
            }
        };

        function ajax(req) {
            var baseUrl = 'http://localhost:3000';
            var d = $q.defer();
            req.url = baseUrl + req.url;

            $http(req)
                .then(function handleSuccess(response) {
                    if (response.data.status == "error") {
                        return d.reject(response.data);
                    }
                    d.resolve(response.data);
                }, function handleError(response) {
                    d.reject(response.data);
                });
            return d.promise;
        }

        function get(req) {
            req.method = "GET";
            return ajax(req);
        }

        function post(req) {
            req.method = "POST";
            return ajax(req);
        }

        function remove(req) {
            req.method = "DELETE";
            return ajax(req);
        }

        function put(req) {
            req.method = "PUT";
            return ajax(req);
        }

        return api;
    }]);