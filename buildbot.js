
projects = [
	{ 
		"name": "ID2",
		"id": "id2",
		"modules": {
			"codeship": {
				"project_id": "???",
				"project_uuid": "???",
				"api_key": "???",
			},
			"coveralls": {
				"repo": "",
			},
			"trello": {
				"board_id": "",
				"api_key": "",
			},
			"github": {
				"repository": "???",
				"api_key": "",
			}
		},
	}
]

BuildBot = {
	timers: [],
	module_handlers: {},
};

BuildBot.init = function() {
	for (idx in projects) {
		project = projects[idx];
		BuildBot.add_project(project);
	}
};

BuildBot.add_project = function(project) {
	console.log("Adding a project:", project.name);
	p = $('<div id="project_' + project.id + '"/>');
	for (module in project.modules) {
		m = $('<div id="module_' + module + '" class="col-md-5"/>');
		m.addClass("neutral");
		BuildBot.add_refresh(module, project, m);
		p.append(m);
	}
	$("#projects").append(p);
};

BuildBot.add_refresh = function(module, project, container) {
	console.log("Adding a module:", module);
	BuildBot.module_handlers[module](project, container); 
	setInterval(function() { 
		console.log("Refreshing module:", module);
		BuildBot.module_handlers[module](project, container); 
	}, 10000);	// Every ten seconds is plenty!
}


BuildBot.module_handlers.codeship = function(project, container) {
	container.empty();
	container.append("<h1>Build Status</h1>");
	var id = project.modules.codeship.project_id;
	var apikey = project.modules.codeship.api_key;
	$.getJSON("https://codeship.com/api/v1/projects/" + id + ".json?api_key=" + apikey, function(data) {
		container.append("<pre>" + data + "</pre>");
	});
}

BuildBot.module_handlers.trello = function(project, container) {
	container.empty();
	container.append("<h1>Tickets</h1>");
}

BuildBot.module_handlers.github = function(project, container) {
	container.empty();
	container.append("<h1>Git archive</h1>");
}

BuildBot.module_handlers.coveralls = function(project, container) {
	container.empty();
	container.append("<h1>Test coverage</h1>");
}


$(function() {
	BuildBot.init();
});

