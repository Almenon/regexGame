describe("practice", function(){

	it("should handle invalid input", function(){
		expect(handleInput('(','')).toBe(false);
		expect(handleInput('a','f')).toBe(false);
		expect(changeFlags('f')).toBe(false);
	})
	it("should not win if incorrect regex", function(){
		expect(iswin(null)).toBe(false);
		expect(iswin([['oeisfjosiejafoij']])).toBe(false);
		expect(handleInput('','')).toEqual('noWin');
	})
	it("should win if correct regex",function(){
		goal = goals[0];
		stringToMatch = possibilities[0];
		expect(handleInput('[a-y]..','g')).toEqual('win')
	});

	describe("when onFlags is called: ", function(){
		it("should change flags", function(){
			changeFlags('g');
			expect(flags).toEqual('g');
			changeFlags('mi');
			expect(flags).toEqual('mi');
		})

		it("should call handleInput", function(){
			spyOn(window,'handleInput');
			changeFlags('g')
			expect(handleInput).toHaveBeenCalled();
		})
	})

});


		//testMatch = [['cat'],['bat'],['sat'],['lat'],['rat'],['mat'],['fat'],]
		//expect(iswin(testMatch)).toBe(true);
