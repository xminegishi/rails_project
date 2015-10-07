require 'test_helper'

class UsersSignupTest < ActionDispatch::IntegrationTest
  
  test "invalid signup information" do
    get signup_path
    assert_no_difference 'User.count' do
      post users_path, user: { name: "",
                              email: "aa@example.com",
                              password: "foo",
                              password_confirmation: "foo"}
    end
    assert_template 'users/new'
  end

  test "valid signup information" do
    get signup_path
    assert_difference 'User.count', 1 do
      post_via_redirect users_path, user: { name: "example user",
                                            email: "user@example.com",
                                            password: "foobar",
                                            password_confirmation: "foobar"}
    end
    assert_template 'users/show'
  end
end
